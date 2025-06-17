import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail, User } from "lucide-react";
import api from "@/utils/axiosInstance";
import SelectField from "../common/SelectField";

export default function ShippingInfoForm({ formData, onChange }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        Thông tin giao hàng
      </h2>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            icon={<User />}
            label="Họ và tên"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            required
          />
          <InputField
            icon={<Phone />}
            label="Số điện thoại"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            required
          />
        </div>
        <InputField
          icon={<Mail />}
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
        />
        <div className="grid md:grid-cols-3 gap-4">
          <SelectField
            label="Tỉnh/Thành phố"
            name="city"
            value={formData.city}
            onChange={onChange}
            required
            options={["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng"]}
          />
          <SelectField
            label="Quận/Huyện"
            name="district"
            value={formData.district}
            onChange={onChange}
            required
            options={["Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 8"]}
          />
          <SelectField
            label="Phường/Xã"
            name="ward"
            value={formData.ward}
            onChange={onChange}
            required
            options={["Phường 1", "Phường 2", "Phường 3", "Phường 4"]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú đơn hàng
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={onChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            placeholder="Ghi chú thêm về đơn hàng (tùy chọn)"
          />
        </div>
      </div>
    </div>
  );
}
function InputField({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
          placeholder={`Nhập ${label.toLowerCase()}`}
        />
      </div>
    </div>
  );
}
