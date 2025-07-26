import { useEffect, useState } from "react";
import { Edit, Trash2, MoreHorizontal, Copy, Send, Plus } from "lucide-react";
import React from "react";

export default function PromotionManager({
  coupons,
  onCreate,
  onUpdate,
  onDelete,
  loading,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    type: "percent",
    discount_percent: 0,
    discount_amount: 0,
    min_order_value: 0,
    max_uses: 0,
    start_date: "",
    end_date: "",
    status: "active",
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".menu-button") &&
        !e.target.closest(".menu-dropdown")
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openAddForm = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      description: "",
      type: "percent",
      discount_percent: 0,
      discount_amount: 0,
      min_order_value: 0,
      max_uses: 0,
      start_date: "",
      end_date: "",
      status: "active",
    });
    setIsModalOpen(true);
  };

  const openEditForm = (coupon) => {
    setEditingCoupon(coupon);
    setFormData(coupon);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCoupon) {
      onUpdate(editingCoupon._id, formData);
    } else {
      onCreate(formData);
    }
    setIsModalOpen(false);
  };

  const handleCopy = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        alert(`Đã sao chép mã: ${code}`);
      })
      .catch((err) => {
        console.error("Lỗi khi sao chép:", err);
        alert("Không thể sao chép mã");
      });
    setOpenMenuId(null);
  };

  const totalCoupon = coupons.length;
  const active = coupons.filter(
    (c) => c.status === "active" && new Date(c.end_date) >= new Date()
  ).length;
  const expired = coupons.filter(
    (c) => new Date(c.end_date) < new Date()
  ).length;
  const used = coupons.reduce((sum, c) => sum + (c.used_count || 0), 0);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Quản lý mã giảm giá</h2>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={openAddForm}
        >
          <Plus className="w-4 h-4" /> Thêm mới
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="border rounded p-4 bg-green-50">
          <p className="text-sm text-green-700">Tổng mã giảm giá</p>
          <p className="text-2xl font-bold text-green-900">{totalCoupon}</p>
        </div>
        <div className="border rounded p-4 bg-green-50">
          <p className="text-sm text-green-700">Đang hoạt động</p>
          <p className="text-2xl font-bold text-green-900">{active}</p>
        </div>
        <div className="border rounded p-4 bg-green-50">
          <p className="text-sm text-green-700">Đã sử dụng</p>
          <p className="text-2xl font-bold text-green-900">{used}</p>
        </div>
        <div className="border rounded p-4 bg-green-50">
          <p className="text-sm text-green-700">Hết hạn</p>
          <p className="text-2xl font-bold text-red-600">{expired}</p>
        </div>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="w-full border border-gray-200 text-sm">
          <thead>
            <tr className="bg-green-100">
              <th className="px-2 py-2 border">Mã</th>
              <th className="px-2 py-2 border">Mô tả</th>
              <th className="px-2 py-2 border">Loại</th>
              <th className="px-2 py-2 border">Giảm</th>
              <th className="px-2 py-2 border">Tối thiểu</th>
              <th className="px-2 py-2 border">Số lượt</th>
              <th className="px-2 py-2 border">Trạng thái</th>
              <th className="px-2 py-2 border">Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="text-center border-b">
                <td className="px-2 py-1 border font-mono">{coupon.code}</td>
                <td className="px-2 py-1 border">{coupon.description}</td>
                <td className="px-2 py-1 border">{coupon.type}</td>
                <td className="px-2 py-1 border">
                  {coupon.type === "percent"
                    ? `${coupon.discount_percent}%`
                    : formatCurrency(coupon.discount_amount)}
                </td>
                <td className="px-2 py-1 border">
                  {formatCurrency(coupon.min_order_value)}
                </td>
                <td className="px-2 py-1 border">{coupon.max_uses}</td>
                <td className="px-2 py-1 border">
                  {coupon.status === "active" ? (
                    <span className="text-green-600 font-semibold">
                      Đang hoạt động
                    </span>
                  ) : (
                    <span className="text-red-600">Tạm dừng</span>
                  )}
                </td>
                <td className="px-2 py-1 border">
                  <div className="relative group">
                    <button
                      className="menu-button text-gray-600 hover:text-black"
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === coupon._id ? null : coupon._id
                        )
                      }
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {openMenuId === coupon._id && (
                      <div className="menu-dropdown absolute right-0 mt-2 w-44 bg-white border rounded shadow-md text-left z-10">
                        <button
                          onClick={() => openEditForm(coupon)}
                          className="w-full px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" /> Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleCopy(coupon.code)}
                          className="w-full px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" /> Sao chép mã
                        </button>
                        <button
                          onClick={() => alert("TODO: Gửi mã")}
                          className="w-full px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" /> Gửi mã
                        </button>
                        <hr />
                        <button
                          onClick={() => onDelete(coupon._id)}
                          className="w-full px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-2">
              {editingCoupon ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá mới"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Mã *</label>
                  <input
                    className="mt-1 w-full border rounded px-3 py-2"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Loại *</label>
                  <select
                    className="mt-1 w-full border rounded px-3 py-2"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="percent">Phần trăm</option>
                    <option value="fixed">Số tiền cố định</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Mô tả</label>
                <textarea
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {formData.type === "percent" ? (
                  <div>
                    <label className="block text-sm font-medium">
                      Giảm (%) *
                    </label>
                    <input
                      type="number"
                      className="mt-1 w-full border rounded px-3 py-2"
                      value={formData.discount_percent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_percent: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium">
                      Giảm (VNĐ) *
                    </label>
                    <input
                      type="number"
                      className="mt-1 w-full border rounded px-3 py-2"
                      value={formData.discount_amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_amount: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium">
                    Đơn tối thiểu *
                  </label>
                  <input
                    type="number"
                    className="mt-1 w-full border rounded px-3 py-2"
                    value={formData.min_order_value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        min_order_value: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Ngày bắt đầu *
                  </label>
                  <input
                    type="date"
                    className="mt-1 w-full border rounded px-3 py-2"
                    value={formData.start_date.slice(0, 10)}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Ngày kết thúc *
                  </label>
                  <input
                    type="date"
                    className="mt-1 w-full border rounded px-3 py-2"
                    value={formData.end_date.slice(0, 10)}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Số lượt sử dụng tối đa *
                </label>
                <input
                  type="number"
                  className="mt-1 w-full border rounded px-3 py-2"
                  value={formData.max_uses}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_uses: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`relative w-12 h-6 flex items-center rounded-full px-1 transition-colors ${
                    formData.status === "active"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      status: prev.status === "active" ? "disabled" : "active",
                    }))
                  }
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                      formData.status === "active"
                        ? "translate-x-6"
                        : "translate-x-0"
                    }`}
                  ></div>
                </button>
                <span className="text-sm">
                  {formData.status === "active"
                    ? "Đang hoạt động"
                    : "Không hoạt động"}
                </span>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {editingCoupon ? "Cập nhật" : "Tạo mã"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
