import { useEffect, useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import CustomerTable from "@/components/admin/customer/CustomerTable";
import { getUser, createUser, updateUser } from "@/services/userService";
import { toast } from "react-toastify";
import CustomerFormModal from "@/components/admin/customer/CustomerFormModal";
import useCustomer from "@/hooks/useCustomer";
import CustomerProfileModal from "@/components/admin/customer/CustomerProfileModal";
import Pagination from "@/components/admin/customer/Pagination";

export default function CustomerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    customers,
    selectedCustomers,
    setSelectedCustomers,
    formModalOpen,
    editingCustomer,
    openForm,
    closeForm,
    handleSubmit,
    toggleStatus,
    viewProfile,
    viewingCustomer,
    profileModalOpen,
    setProfileModal,
    currentPage,
    setCurrentPage,
    totalPages,
    handleBulkDelete,
    handleBulkStatusUpdate,
  } = useCustomer();

  const toggleCustomerSelection = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };
  const toggleAllCustomers = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map((customer) => customer._id));
    }
  };
  const visibleCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && customer.status) ||
      (statusFilter === "inactive" && !customer.status);

    return matchesSearch && matchesStatus;
  });

  const selectedCustomerObjects = customers.filter((c) =>
    selectedCustomers.includes(c._id)
  );

  const allActive = selectedCustomerObjects.every((c) => c.status === true);
  const allInactive = selectedCustomerObjects.every((c) => c.status === false);

  return (
    <>
      {selectedCustomers.length > 0 && (
        <div className="bg-yellow-50 p-3 rounded flex justify-between items-center border">
          <span className="text-sm">
            {selectedCustomers.length} khách hàng được chọn
          </span>
          <div className="flex gap-2">
            {!allActive && (
              <button
                onClick={() => handleBulkStatusUpdate(true)}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded"
              >
                Kích hoạt
              </button>
            )}

            {!allInactive && (
              <button
                onClick={() => handleBulkStatusUpdate(false)}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
              >
                Vô hiệu hóa
              </button>
            )}

            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded"
            >
              Xóa
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Khách hàng</h1>

          <button
            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded gap-2 text-sm font-medium"
            onClick={() => {
              openForm();
            }}
          >
            <Plus className="h-4 w-4" />
            Thêm khách hàng
          </button>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              className="w-full border border-gray-300 rounded bg-white pr-4 py-2 pl-8 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 shadow-sm"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              name=""
              id=""
              className="w-[150px] rounded border border-gray-300 bg-white focus:outline-none px-4 py-2 text-sm shadow-sm"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả he</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>
        <CustomerTable
          customers={visibleCustomers}
          selectedCustomers={selectedCustomers}
          toggleCustomerSelection={toggleCustomerSelection}
          toggleAllCustomers={toggleAllCustomers}
          onToggleStatus={toggleStatus}
          onEditCustomer={openForm}
          onViewProfile={viewProfile}
        />
        <CustomerFormModal
          open={formModalOpen}
          onClose={() => {
            closeForm();
          }}
          onSubmit={handleSubmit}
          initialData={editingCustomer}
        />
        <CustomerProfileModal
          open={profileModalOpen}
          onClose={() => {
            setProfileModal(false);
          }}
          customer={viewingCustomer}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
