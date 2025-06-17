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
    res.json(orders);
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
    });

    const orderItems = cart.items.map((item) => ({
      order: newOrder._id,
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));
    await OrderItem.insertMany(orderItems);

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

    // Lấy thông tin đơn hàng
    const order = await Order.findOne({ _id: orderId, user: userId });

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
    }));

    res.json({
      orderId: order._id,
      shippingInfo: order.shipping_address,
      paymentMethod: order.payment_method,
      status: order.status,
      items: formattedItems,
    });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", err.message);
    res.status(500).json({ message: "Không thể lấy đơn hàng" });
  }
};
