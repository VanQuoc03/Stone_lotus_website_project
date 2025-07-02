const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const User = require("../models/user");
const moment = require("moment");
const ProductInventory = require("../models/productInventory");
const Category = require("../models/Category");
const Product = require("../models/product");
const {
  getStartDate,
  timeMap,
  getPreviousRange,
} = require("../utils/timeRange");

const getSummary = async (req, res) => {
  try {
    const range = req.query.range || "7d";
    const start = getStartDate(range).toDate();
    const { start: prevStartMoment, end: prevEndMoment } =
      getPreviousRange(range);
    const prevStart = prevStartMoment.toDate();
    const prevEnd = prevEndMoment.toDate();

    const orders = await Order.find({
      createdAt: { $gte: start },
      status: "completed",
    });

    const orderIds = orders.map((o) => o._id);
    const items = await OrderItem.find({ order: { $in: orderIds } });

    const revenue = orders.reduce((sum, o) => sum + o.total_price, 0);
    const orderCount = orders.length;
    const productsSold = items.reduce((sum, i) => sum + i.quantity, 0);
    const newCustomers = await User.countDocuments({
      created_at: { $gte: start },
      role: "customer",
    });

    const prevOrders = await Order.find({
      createdAt: { $gte: prevStart, $lt: prevEnd },
      status: "completed",
    });
    const prevOrderIds = prevOrders.map((o) => o._id);
    const prevItems = await OrderItem.find({ order: { $in: prevOrderIds } });

    const prevRevenue = prevOrders.reduce((sum, o) => sum + o.total_price, 0);
    const prevOrderCount = prevOrders.length;
    const prevProductsSold = prevItems.reduce((sum, i) => sum + i.quantity, 0);
    const prevNewCustomers = await User.countDocuments({
      created_at: { $gte: prevStart, $lt: prevEnd },
      role: "customer",
    });

    const calcChange = (cur, prev) =>
      prev === 0 ? (cur > 0 ? 1 : 0) : (cur - prev) / prev;

    res.json({
      revenue,
      orderCount,
      productsSold,
      newCustomers,
      comparison: {
        revenue: calcChange(revenue, prevRevenue),
        orderCount: calcChange(orderCount, prevOrderCount),
        productsSold: calcChange(productsSold, prevProductsSold),
        newCustomers: calcChange(newCustomers, prevNewCustomers),
      },
    });
  } catch (err) {
    console.error("Lỗi dashboard:", err.message);
    res.status(500).json({ message: "Lỗi server khi thống kê tổng quan" });
  }
};

const getSalesChart = async (req, res) => {
  try {
    const range = req.query.range || "7d";
    const config = timeMap[range] || timeMap["7d"];
    const start = getStartDate(range);

    const orders = await Order.find({
      createdAt: { $gte: start.toDate() },
      status: "completed",
    }).select("total_price createdAt");

    const chartData = [];
    for (let i = 0; i < config.count; i++) {
      const time = moment(start).add(i, config.unit);
      const label =
        config.unit === "hour"
          ? time.format("HH:mm")
          : time.format("YYYY-MM-DD");

      const startTime = moment(time).startOf(config.unit);
      const endTime = moment(time).endOf(config.unit);

      const filtered = orders.filter((o) =>
        moment(o.createdAt).isBetween(startTime, endTime, undefined, "[]")
      );

      const totalRevenue = filtered.reduce((sum, o) => sum + o.total_price, 0);

      chartData.push({
        date: label,
        revenue: totalRevenue,
        orders: filtered.length,
      });
    }
    res.json(chartData);
  } catch (err) {
    console.error("Lỗi biểu đồ doanh thu:", err);
    res.status(500).json({ message: "Không thể tạo dữ liệu biểu đồ" });
  }
};

const getInventorySummary = async (req, res) => {
  try {
    const range = req.query.range || "7d";
    const since = getStartDate(range);

    const total = await ProductInventory.countDocuments();
    const lowStock = await ProductInventory.countDocuments({
      quantity: { $lte: 5 },
    });
    const newlyAdded = await ProductInventory.countDocuments({
      createdAt: { $gte: since },
    });

    res.json({ total, lowStock, newlyAdded });
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy thống kê kho hàng" });
  }
};

const getCategorySummary = async (req, res) => {
  try {
    const categories = await Category.find();

    const counts = await Product.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const countMap = counts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const result = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      count: countMap[cat._id.toString()] || 0,
    }));
    res.json(result);
  } catch (err) {
    console.error("Lỗi thống kê danh mục:", err);
    res.status(500).json({ error: "Không thể thống kê danh mục" });
  }
};

const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy đơn hàng gần đây" });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const threshold = 5;

    const inventories = await ProductInventory.find({
      quantity: { $lte: threshold },
    })
      .sort({ quantity: 1 })
      .limit(5)
      .populate({
        path: "product",
        populate: [
          { path: "category", select: "name" },
          { path: "images", select: "image_url" },
        ],
      });

    const result = inventories.map((inv) => {
      const p = inv.product;
      return {
        id: p._id,
        name: p.name,
        quantity: inv.quantity,
        updatedAt: inv.last_updated,
        category: p.category?.name || "Không rõ",
        image: p.images?.[0]?.image_url || null,
        needRestock: inv.quantity <= threshold,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi lấy sản phẩm sắp hết hàng:", err.message);
    res.status(500).json({ message: "Không thể lấy dữ liệu sản phẩm sắp hết" });
  }
};

module.exports = {
  getSummary,
  getSalesChart,
  getInventorySummary,
  getCategorySummary,
  getRecentOrders,
  getLowStockProducts,
};
