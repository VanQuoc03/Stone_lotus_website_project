const ProductInventory = require("../models/productInventory");

const getInventory = async (req, res) => {
  const { productId } = req.params;
  const inventory = await ProductInventory.findOne({ product: productId });
  if (!inventory)
    return res.status(404).json({ message: "Không có dữ liệu tồn kho" });
  res.json(inventory);
};
const updateInventory = async (req, res) => {
  const { quantity } = req.body;

  const updateOps = {
    $set: {
      last_updated: new Date(),
    },
  };

  if (quantity !== undefined) {
    updateOps.$set.quantity = quantity;
  }


  const updated = await ProductInventory.findOneAndUpdate(
    { product: req.params.productId },
    updateOps,
    { new: true, upsert: true }
  );

  res.json({ message: "Đã cập nhật tồn kho", inventory: updated });
};


module.exports = { getInventory, updateInventory };
