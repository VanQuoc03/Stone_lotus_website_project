import api from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function SalesChart({ range = "7d" }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchChart = async () => {
      const res = await api.get(`/api/dashboard/sales-chart?range=${range}`);
      console.log(res.data);
      setData(res.data);
    };
    fetchChart();
  }, [range]);

  return (
    <div className="w-full h-[300px]">
      {data.length === 0 ? (
        <p className="text-center text-sm text-gray-500 mt-10">
          Không có dữ liệu trong khoảng thời gian này
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="line"
              wrapperStyle={{ paddingTop: 16 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              strokeWidth={2}
              stroke="#10B981"
              name="Doanh thu"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Đơn hàng"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
