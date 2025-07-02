import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "@/utils/axiosInstance";

const COLORS = ["#34D399", "#60A5FA", "#F59E0B", "#EF4444", "#A78BFA"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white border rounded p-2 shadow-md w-48">
        <div className="font-semibold text-sm mb-1">{item.name}</div>
        {item.images?.[0]?.url && (
          <img
            src={item.images[0].url}
            alt={item.name}
            className="w-full h-24 object-cover rounded mb-1"
          />
        )}
        <div className="text-sm text-gray-600">{item.views} lượt xem</div>
      </div>
    );
  }
  return null;
};

export default function TopProductsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      const res = await api.get("/api/featured?type=product&limit=5");
      setData(res.data);
    };
    fetchTopProducts();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h2 className="text-xl font-bold">Sản phẩm phổ biến</h2>
      <p className="text-sm text-gray-500 mb-4">
        Top sản phẩm được xem nhiều nhất
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="views"
            label={({ name, views }) => `${name} (${views} lượt xem)`}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />

          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
