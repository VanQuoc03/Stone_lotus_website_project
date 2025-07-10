const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate({
      path: "items.product",
      select: "name price status",
      populate: [
        { path: "images", select: "image_url -_id" },
        { path: "inventory", select: "stock" },
      ],
    });
    res.json(cart || { items: [] });
  } catch (error) {
    console.error("Lỗi lấy giỏ hàng:", error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi khi lấy giỏ hàng" });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ error: "Thiếu productId" });
    }

    const product = await Product.findById(productId).populate("inventory");
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }

    const availableStock = product.inventory ? product.inventory.quantity : 0;
    if (availableStock < quantity) {
      return res.status(400).json({
        error: `Số lượng yêu cầu (${quantity}) vượt quá số lượng trong kho (${availableStock})`,
      });
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
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (newQuantity > availableStock) {
          return res.status(400).json({
            error: `Số lượng yêu cầu (${newQuantity}) vượt quá số lượng trong kho (${availableStock})`,
          });
        }
        cart.items[itemIndex].quantity = newQuantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name price status",
      populate: [
        { path: "images", select: "image_url -_id" },
        { path: "inventory", select: "quantity" },
      ],
    });
    res.json(populatedCart || { items: [] });
  } catch (error) {
    console.error("Lỗi thêm vào giỏ hàng:", error.message);
    res.status(500).json({ error: "Đã xảy ra lỗi khi thêm vào giỏ hàng" });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: "Số lượng phải lớn hơn 0" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    const item = cart.items.find(
      (i) => i.product && i.product.toString() === productId
    );
    if (!item) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong giỏ hàng" });
    }

    const product = await Product.findById(productId).populate("inventory");
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }

    const availableStock = product.inventory ? product.inventory.quantity : 0;
    if (quantity > availableStock) {
      return res.status(400).json({
        error: `Số lượng yêu cầu (${quantity}) vượt quá số lượng trong kho (${availableStock})`,
      });
    }

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name price status",
      populate: [
        { path: "images", select: "image_url -_id" },
        { path: "inventory", select: "quantity" },
      ],
    });
    res.json(populatedCart || { items: [] });
  } catch (error) {
    console.error("Lỗi cập nhật số lượng:", error.message);
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
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
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
    if (!cart)
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    res.json({ message: "Giỏ hàng đã được xóa", cart });
  } catch (error) {
    console.error("Lỗi xóa giỏ hàng:", error.message);
    res.status(500).json({ error: "Có lỗi xảy ra khi xóa giỏ hàng" });
  }
};
