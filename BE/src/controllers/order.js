const dispatchEmail = require("../utils/emailDispatcher");
const sendOrderEmail = require("../utils/sendOrderEmail");
const orderConfirmationTemplate = require("../utils/emailTemplates/orderConfirmation");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Cart = require("../models/cart");
const ProductInventory = require("../models/productInventory");

exports.getAllOrders = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const query = isAdmin ? {} : { user: req.user.id };
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
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
    res.json(ordersWithItems);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", err.message);
    res.status(500).json({ message: "Không thể lấy đơn hàng" });
  }
};

exports.placeOrder = async (req, res) => {
  const userId = req.user.id;
  const { shippingInfo, paymentMethod } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price",
    });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng rỗng" });
    }

    //Kiểm tra tồn kho
    for (const item of cart.items) {
      const inventory = await ProductInventory.findOne({
        product: item.product._id,
      });
      if (!inventory || inventory.quantity < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm "${item.product.name}" không đủ hàng trong kho`,
        });
      }
    }

    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
    const shipping = subtotal >= 500000 ? 0 : 30000;
    const totalPrice = subtotal + shipping;

    const newOrder = await Order.create({
      user: userId,
      total_price: totalPrice,
      shipping_address: shippingInfo,
      payment_method: paymentMethod,
      status: "pending",
      timeline: [
        {
          status: "pending",
          note: "Đơn hàng đã được tạo và chờ xác nhận",
          timestamp: new Date(),
        },
      ],
    });

    const orderItems = cart.items.map((item) => ({
      order: newOrder._id,
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));
    await OrderItem.insertMany(orderItems);

    const fullOrder = await Order.findById(newOrder._id);

    await dispatchEmail({
      type: "confirmation",
      order: fullOrder,
    });

    //Cập nhật kho hàng
    for (const item of cart.items) {
      await ProductInventory.findOneAndUpdate(
        { product: item.product._id },
        {
          $inc: { quantity: -item.quantity },
          $set: { last_updated: new Date() },
        }
      );
    }

    cart.items = [];
    await cart.save();
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
      select: "name price images",
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
