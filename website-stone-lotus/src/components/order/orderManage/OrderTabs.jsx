import {
  getOrderStatusMeta,
  ORDER_STATUSES,
} from "@/shared/constants/orderStatus";

export default function OrderTabs({
  statusFilter,
  setStatusFilter,
  statusCounts,
}) {
  const tabs = [
    { label: "Tất cả", value: "all", count: statusCounts.all },
    ...ORDER_STATUSES.map((status) => {
      const { label } = getOrderStatusMeta(status);
      return {
        label,
        value: status,
        count: statusCounts[status] || 0,
      };
    }),
  ];

  return (
    <div className="flex justify-between overflow-x-auto mb-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setStatusFilter(tab.value)}
          className={`px-4 py-2 whitespace-nowrap border-b-2 text-sm font-medium transition-colors duration-200
            ${
              statusFilter === tab.value
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-500"
            }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
}
