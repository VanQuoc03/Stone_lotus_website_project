import { useEffect, useState } from "react";
import { getUser, createUser, updateUser } from "@/services/userService";
import { toast } from "react-toastify";
import { bulkDeleteUsers, bulkUpdateUserStatus } from "@/services/userService";

export default function useCustomer() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [profileModalOpen, setProfileModal] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await getUser(currentPage, itemsPerPage);
        console.log("Fetched:", res);
        setCustomers(res.data);
        setTotalPages(res.totalPage);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        toast.error("Không thể lấy dữ liệu khách hàng");
      }
    };
    fetchCustomer();
  }, [currentPage]);

  const handleSubmit = async (data, id) => {
    try {
      let result;
      if (id) {
        const original = customers.find((c) => c._id === id);
        const isSame =
          JSON.stringify(data) ===
          JSON.stringify({
            name: original.name,
            email: original.email,
            status: original.status,
          });
        if (isSame) {
          toast.info("Không có thay đổi nào để cập nhật.");
          return;
        }
        if (data.password === "") delete data.password;
        result = await updateUser(id, data);
        setCustomers((prev) => prev.map((c) => (c._id === id ? result : c)));
        toast.success("Cập nhật khách hàng thành công!");
      } else {
        result = await createUser(data);
        setCustomers((prev) => [...prev, result]);
        toast.success("Thêm khách hàng thành công!");
      }
      closeForm();
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra");
    }
  };
  const toggleStatus = async (customer) => {
    const confirmed = window.confirm(
      customer.status
        ? "Bạn có chắc chắn muốn vô hiệu hóa người dùng này?"
        : "Bạn có chắc chắn muốn kích hoạt người dùng này?"
    );
    if (!confirmed) return;
    try {
      const updated = await updateUser(customer._id, {
        status: !customer.status,
      });
      setCustomers((prev) =>
        prev.map((c) => (c._id === customer._id ? updated : c))
      );
      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái!");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCustomers.length === 0) return;

    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa các khách hàng đã chọn?"
    );
    if (!confirmed) return;

    try {
      await bulkDeleteUsers(selectedCustomers);
      toast.success("Xóa thành công!");
      setCustomers((prev) =>
        prev.filter((c) => !selectedCustomers.includes(c._id))
      );
      setSelectedCustomers([]);
    } catch (error) {
      toast.error("Xóa thất bại!");
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedCustomers.length === 0) return;

    const confirmed = window.confirm(
      `Bạn có chắc muốn ${
        newStatus ? "kích hoạt" : "vô hiệu hóa"
      } những người dùng này không?`
    );
    if (!confirmed) return;

    try {
      await bulkUpdateUserStatus(selectedCustomers, newStatus);
      setCustomers((prev) =>
        prev.map((c) =>
          selectedCustomers.includes(c._id) ? { ...c, status: newStatus } : c
        )
      );
      toast.success("Cập nhật trạng thái thành công!");
      setSelectedCustomers([]);
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  const openForm = (customer = null) => {
    setEditingCustomer(customer);
    setFormModalOpen(true);
  };

  const closeForm = () => {
    setEditingCustomer(null);
    setFormModalOpen(false);
  };
  const viewProfile = (customer) => {
    setViewingCustomer(customer);
    setProfileModal(true);
  };

  return {
    customers,
    setCustomers,
    selectedCustomers,
    setSelectedCustomers,
    loading,
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
  };
}
