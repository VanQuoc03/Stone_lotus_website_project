import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ShoppingCart,
  Users,
  Leaf,
  DollarSign,
} from "lucide-react";
import api from "@/utils/axiosInstance";

const formatter = new Intl.NumberFormat("vi-VN");

const statusConfig = [
  {
    key: "revenue",
    label: "Doanh thu",
    icon: <DollarSign className="h-5 w-5 text-green-600" />,
    format: (value) => formatter.format(value) + "đ",
  },
  {
    key: "orderCount",
    label: "Đơn hàng",
    icon: <ShoppingCart className="h-5 w-5 text-green-600" />,
    format: (value) => `+${value}`,
  },
  {
    key: "productsSold",
    label: "Sản phẩm đã bán",
    icon: <Leaf className="h-5 w-5 text-green-600" />,
    format: (value) => `${value}`,
  },
  {
    key: "newCustomers",
    label: "Khách hàng mới",
    icon: <Users className="h-5 w-5 text-green-600" />,
    format: (value) => `+${value}`,
  },
];

export default function SummaryCards({ range = "7d" }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/dashboard?range=${range}`);
        setData(res.data);
      } catch (err) {
        console.error("Lỗi lấy dashboard summary", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range]);

  if (loading) return <div className="text-sm text-gray-500">Đang tải...</div>;
  if (!data)
    return <div className="text-sm text-red-500">Không có dữ liệu</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statusConfig.map((s) => {
        const value = data[s.key];
        const change = data.comparison[s.key];
        const isIncrease = change >= 0;
        return (
          <div
            key={s.key}
            className="bg-white p-4 rounded-lg shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">{s.label}</h4>
              {s.icon}
            </div>
            <div className="text-2xl font-bold">{s.format(value)}</div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span
                className={
                  isIncrease
                    ? "text-green-500 flex items-center gap-1"
                    : "text-red-500 flex items-center gap-1"
                }
              >
                {isIncrease ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {(change * 100).toFixed(1)}%
              </span>
              <span className="ml-1">so với kỳ trước</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
