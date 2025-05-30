import { CheckCircle, Repeat, Truck, MessageCircle } from "lucide-react";

export default function ProductPolicy() {
  const policies = [
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      text: "Cây khỏe mạnh 100% khi giao đến tay bạn",
    },
    {
      icon: <Repeat className="w-5 h-5 text-yellow-500" />,
      text: "Đổi trả dễ dàng trong 3 ngày",
    },
    {
      icon: <Truck className="w-5 h-5 text-blue-500" />,
      text: "Giao hàng toàn quốc trong 2-4 ngày",
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-purple-500" />,
      text: "Hỗ trợ tư vấn miễn phí 24/7",
    },
  ];
  return (
    <div className="mt-6 space-y-2 text-sm text-gray-700">
      {policies.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.icon}
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}
