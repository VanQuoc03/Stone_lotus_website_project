const Cart = require("../models/cart");

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate({
    path: "items.product",
    select: "name price status",
    populate: [
      {
        path: "images",
        select: "image_url -_id",
      },
      { path: "inventory", select: "stock" },
    ],
  });
  res.json(cart || { items: [] });
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ error: "Thiếu productId" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product && item.product.toString() === productId
      );
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Lỗi thêm vào giỏ hàng: ", error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi khi thêm vào giỏ hàng" });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart)
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Lỗi updateQuantity:", error.message);
    res.status(500).json({ error: "Có lỗi xảy ra khi cập nhật số lượng" });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { items: { product: productId } } },
      { new: true }
    ).populate({
      path: "items.product",
      select: "name price status",
      populate: [
        { path: "images", select: "image_url -_id" },
        { path: "inventory", select: "stock" },
      ],
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart không tồn tại" });
    }

    res.json(cart);
  } catch (error) {
    console.error("Lỗi xóa sản phẩm trong giỏ:", error.message);
    res.status(500).json({ error: "Lỗi khi xóa sản phẩm khỏi giỏ hàng" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { items: [] } },
      { new: true }
    );
    if (!cart) return res.status(404).json({ message: "Cart không tồn tại" });
    res.json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ error: "Có lỗi xảy ra khi xóa giỏ hàng" });
  }
};
