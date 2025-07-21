const dispatchEmail = require("../utils/emailDispatcher");
const sendOrderEmail = require("../utils/sendOrderEmail");
const orderConfirmationTemplate = require("../utils/emailTemplates/orderConfirmation");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Cart = require("../models/cart");
const ProductInventory = require("../models/productInventory");
const Product = require("../models/product");
exports.getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sort = "createdAt_desc",
    } = req.query;

    const isAdmin = req.user.role === "admin";
    let query = isAdmin ? {} : { user: req.user.id };

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      query.$or = [
        { "shipping_address.fullName": searchRegex },
        { "shipping_address.phone": searchRegex },
      ];
      // Check if search term could be a valid ObjectId
      if (search.match(/^[0-9a-fA-F]{24}$/)) {
        query.$or.push({ _id: search });
      }
    }

    const [sortField, sortOrder] = sort.split("_");
    const sortOptions = {};
    if (sortField) {
      sortOptions[sortField] = sortOrder === "asc" ? 1 : -1;
    } else {
      sortOptions.createdAt = -1; // Default sort
    }

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    const orders = await Order.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("user", "name email")
      .lean();

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ order: order._id }).populate({
          path: "product",
          select: "name price images",
          populate: {
            path: "images",
            select: "image_url -_id",
          },
        });

        const formattedItems = items.map((item) => ({
          id: item._id,
          name: item.product?.name,
          image: item.product?.images?.[0]?.image_url || null,
          price: item.price,
          quantity: item.quantity,
          productId: item.product?._id,
        }));

        return {
          ...order,
          id: order._id.toString(), // để tương thích với OrderCard dùng order.id
          items: formattedItems,
        };
      })
    );
    res.json({
      orders: ordersWithItems,
      currentPage: parseInt(page),
      totalPages,
      totalOrders,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", err.message);
    res.status(500).json({ message: "Không thể lấy đơn hàng" });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingInfo, paymentMethod, items, shippingFee } = req.body;

    const itemsToProcess =
      items ||
      (
        await Cart.findOne({ user: userId }).populate({
          path: "items.product",
          select: "name price images",
          populate: {
            path: "images",
            select: "image_url - _id",
          },
        })
      ).items;

    if (!itemsToProcess || itemsToProcess.length === 0) {
      return res.status(400).json({ message: "Không có sản phẩm để đặt hàng" });
    }

    let subtotal = 0;
    const orderItems = [];
    for (const item of itemsToProcess) {
      const productId = item.product?._id || item.product;
      const product = await Product.findById(productId).populate("inventory");
      if (!product) {
        return res
          .status(404)
          .json({ message: `Sản phẩm ${productId} không tồn tại` });
      }

      const availableStock =
        product.inventory && typeof product.inventory.quantity === "number"
          ? product.inventory.quantity
          : 0;
      if (item.quantity > availableStock) {
        return res.status(400).json({
          error: `Số lượng yêu cầu (${item.quantity}) vượt quá số lượng trong kho (${availableStock}) cho sản phẩm ${product.name}`,
        });
      }

      const price = product.price || 0;
      subtotal += price * item.quantity;
      orderItems.push({
        order: null,
        product: productId,
        image: product.images?.[0]?.image_url || null,
        quantity: item.quantity,
        price,
        variantId: item.variantId || null,
      });
    }
    const shipping = typeof shippingFee === "number" ? shippingFee : 30000;
    const totalPrice = subtotal + shipping;

    const newOrder = await Order.create({
      user: userId,
      total_price: totalPrice,
      shipping_address: shippingInfo,
      payment_method: paymentMethod,
      shipping_fee: shipping,
      status: "pending",
      timeline: [
        {
          status: "pending",
          note: "Đơn hàng đã được tạo và chờ xác nhận",
          timestamp: new Date(),
        },
      ],
    });

    orderItems.forEach((item) => (item.order = newOrder._id));
    await OrderItem.insertMany(orderItems);

    // Cập nhật tồn kho & số lượng đã bán
    for (const item of itemsToProcess) {
      const productId = item.product?._id || item.product;
      const inventory = await ProductInventory.findOneAndUpdate(
        { product: productId },
        {
          $inc: { quantity: -item.quantity },
          $set: { last_updated: new Date() },
        },
        { new: true }
      );
      if (!inventory) {
        throw new Error(`Không tìm thấy tồn kho cho sản phẩm ${productId}`);
      }
      await Product.findByIdAndUpdate(
        productId,
        {
          $inc: { sold: item.quantity },
        },
        { new: false }
      );
    }

    // Xóa giỏ hàng
    const userCart = await Cart.findOne({ user: userId });

    if (req.body.fromCart) {
      // Nếu là từ giỏ hàng: xóa toàn bộ
      await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
    } else {
      // Nếu là "Mua ngay": chỉ xóa sản phẩm đã mua
      const productIdsToRemove = itemsToProcess.map(
        (item) => item.product?._id?.toString?.() || item.product.toString()
      );

      const updatedItems = userCart.items.filter((item) => {
        const itemId =
          item.product?._id?.toString?.() || item.product.toString();
        return !productIdsToRemove.includes(itemId);
      });

      await Cart.findOneAndUpdate(
        { user: userId },
        { $set: { items: updatedItems } }
      );
    }

    const fullOrder = await Order.findById(newOrder._id).populate({
      path: "user",
      select: "name email",
    });

    await dispatchEmail({
      type: "confirmation",
      order: fullOrder,
    });
    res.status(201).json({
      message: "Đặt hàng thành công",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Lỗi đặt hàng:", error);
    res.status(500).json({ message: "Đặt hàng thất bại, hãy thử lại sau." });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    const isAdmin = req.user.role === "admin";
    const query = isAdmin ? { _id: orderId } : { _id: orderId, user: userId };
    // Lấy thông tin đơn hàng
    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // Lấy các sản phẩm trong đơn hàng
    const items = await OrderItem.find({ order: order._id }).populate({
      path: "product",
      select: "name price",
      populate: {
        path: "images",
        select: "image_url -_id",
      },
    });

    // Format dữ liệu trả về
    const formattedItems = items.map((item) => ({
      id: item._id,
      name: item.product.name,
      image: item.product?.images?.[0]?.image_url || null,
      price: item.price,
      quantity: item.quantity,
      productId: item.product._id,
    }));

    res.json({
      orderId: order._id,
      total_price: order.total_price,
      shipping_fee: order.shipping_fee,
      shippingInfo: order.shipping_address,
      paymentMethod: order.payment_method,
      status: order.status,
      items: formattedItems,
      createdAt: order.createdAt,
      timeline: order.timeline,
      cancelledAt: order.cancelledAt,
      cancelledBy: order.cancelledBy,
      cancelReason: order.cancelReason,
    });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", err.message);
    res.status(500).json({ message: "Không thể lấy đơn hàng" });
  }
};
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (order.status === status) {
      return res.status(400).json({ message: "Trạng thái đã giống hiện tại" });
    }

    order.status = status;
    order.timeline = order.timeline || [];
    order.timeline.push({
      status,
      note: note || `Cập nhật trạng thái thành ${status}`,
      timestamp: new Date(),
    });

    await order.save();

    if (status === "completed") {
      try {
        await sendOrderEmail({
          to: order.shipping_address.email,
          subject: `Đơn hàng #${order._id
            .toString()
            .slice(-6)
            .toUpperCase()} đã hoàn thành`,
          html: orderStatusUpdateTemplate({
            fullName: order.shipping_address.fullName,
            orderId: order._id.toString().slice(-6).toUpperCase(),
            status,
            note,
          }),
        });
      } catch (emailError) {
        console.error("Gửi email thất bại:", emailError.message);
      }
    }

    res.json({ message: "Cập nhật trạng thái thành công", order });
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái:", err.message);
    res.status(500).json({ message: "Lỗi cập nhật trạng thái" });
  }
};

exports.manualSendEmail = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    await dispatchEmail({ type, order });

    res.json({ message: "Đã gửi email thành công" });
  } catch (err) {
    console.error("Lỗi gửi email thủ công:", err.message);
    res.status(500).json({ message: "Không thể gửi email" });
  }
};

exports.cancelOrder = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Đơn hàng đã bị hủy trước đó" });
    }

    order.status = "cancelled";
    order.cancelledAt = new Date();
    order.cancelledBy = req.user?.name || "Hệ thống";
    order.cancelReason = reason || "Không có lý do cụ thể";

    order.timeline = order.timeline || [];
    order.timeline.push({
      status: "cancelled",
      note: `Đơn hàng bị hủy: ${order.cancelReason}`,
      timestamp: new Date(),
    });

    await order.save();
    await dispatchEmail({
      type: "status",
      order,
      note: order.cancelReason,
    });

    res.json({
      message: "Đã hủy đơn hàng thành công",
      order,
    });
  } catch (err) {
    console.error("Lỗi khi hủy đơn hàng:", err.message);
    res.status(500).json({ message: "Không thể hủy đơn hàng" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    const orderIds = orders.map((order) => order._id);

    const items = await OrderItem.find({ order: { $in: orderIds } })
      .populate({
        path: "product",
        select: "name price",
        populate: {
          path: "images",
          select: "image_url -_id",
        },
      })
      .lean();

    const groupedItems = {};
    items.forEach((item) => {
      const key = item.order.toString();
      if (!groupedItems[key]) groupedItems[key] = [];
      groupedItems[key].push(item);
    });

    const enrichedOrders = orders.map((order) => {
      const key = order._id.toString();
      return {
        ...order,
        items: groupedItems[key] || [],
      };
    });

    res.json(enrichedOrders);
  } catch (err) {
    console.error("Lỗi khi lấy đơn hàng của người dùng:", err);
    res.status(500).json({ message: "Không thể lấy đơn hàng của bạn" });
  }
};
