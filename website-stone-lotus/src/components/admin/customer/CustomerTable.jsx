import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, Mail, MoreHorizontal } from "lucide-react";
import dayjs from "dayjs";

export default function CustomerTable({
  customers,
  selectedCustomers,
  toggleCustomerSelection,
  toggleAllCustomers,
  onEditCustomer,
  onToggleStatus,
  onViewProfile,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".dropdown-toggle")
      ) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!dropdownOpen || !dropdownRef.current) return;

    const dropdownHeight = 200;
    const spaceBelow =
      window.innerHeight - dropdownRef.current.getBoundingClientRect().bottom;
    const spaceAbove = dropdownRef.current.getBoundingClientRect().top;

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropdownPosition("top");
    } else {
      setDropdownPosition("bottom");
    }
  }, [dropdownOpen]);

  const getInitials = (name) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value || 0);

  return (
    <div className="rounded-md border overflow-auto relative">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-[50px] p-2">
              <input
                type="checkbox"
                checked={
                  selectedCustomers.length === customers.length &&
                  customers.length > 0
                }
                onChange={toggleAllCustomers}
              />
            </th>
            <th className="p-2">
              Khách hàng <ArrowUpDown className="inline h-4 w-4 ml-1" />
            </th>
            <th className="p-2">Trạng thái</th>
            <th className="hidden md:table-cell p-2">
              Đơn hàng <ArrowUpDown className="inline h-4 w-4 ml-1" />
            </th>
            <th className="hidden md:table-cell p-2">
              Tổng chi tiêu <ArrowUpDown className="inline h-4 w-4 ml-1" />
            </th>
            <th className="hidden md:table-cell p-2">
              Ngày đăng ký <ArrowUpDown className="inline h-4 w-4 ml-1" />
            </th>
            <th className="w-[100px] p-2"></th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id} className="border-t relative">
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(customer._id)}
                  onChange={() => toggleCustomerSelection(customer._id)}
                />
              </td>
              <td className="p-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                    {getInitials(customer.name)}
                  </div>
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-xs text-gray-500">
                      {customer.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-2 text-center">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    customer.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {customer.status ? "Đang hoạt động" : "Không hoạt động"}
                </span>
              </td>
              <td className="hidden md:table-cell p-2 text-center">12</td>
              <td className="hidden md:table-cell p-2 text-center">
                {formatCurrency(customer.total_spent)}
              </td>
              <td className="hidden md:table-cell p-2 text-center">
                {dayjs(customer.created_at).format("DD/MM/YYYY - HH:mm")}
              </td>
              <td className="p-2 text-center">
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded-full">
                    <Mail className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-100 rounded-full dropdown-toggle"
                    onClick={() =>
                      setDropdownOpen(
                        dropdownOpen === customer._id ? null : customer._id
                      )
                    }
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                {dropdownOpen === customer._id && (
                  <div
                    className={`absolute z-50 w-48 rounded-md border bg-white shadow-md animate-fade-in transition-all ${
                      dropdownPosition === "top" ? "bottom-12" : "top-12"
                    } right-2`}
                    ref={dropdownRef}
                  >
                    <div className="px-4 py-2 text-sm font-semibold">
                      Thao tác
                    </div>
                    <div
                      className="border-t px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        onViewProfile?.(customer);
                        setDropdownOpen(null);
                      }}
                    >
                      Xem hồ sơ
                    </div>
                    <div
                      className="px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        onEditCustomer?.(customer);
                        setDropdownOpen(null);
                      }}
                    >
                      Chỉnh sửa
                    </div>
                    <div className="border-t px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer">
                      Xem đơn hàng
                    </div>
                    <div
                      className="border-t px-4 py-2 text-sm hover:bg-red-100 text-red-600 cursor-pointer"
                      onClick={() => {
                        onToggleStatus?.(customer);
                        setDropdownOpen(null);
                      }}
                    >
                      {customers.find((c) => c._id === dropdownOpen)?.status
                        ? "Vô hiệu hóa"
                        : "Kích hoạt"}
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
