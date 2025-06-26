import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail, User } from "lucide-react";
import SelectField from "../common/SelectField";
import {
  getProvinces,
  getDistrictsByProvince,
  getWardsByDistrict,
} from "@/services/locationAPI";

export default function ShippingInfoForm({
  formData,
  onChange,
  setLocationData,
}) {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (setLocationData) {
      setLocationData({ cities, districts, wards });
    }
  }, [cities, districts, wards]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await getProvinces();
        setCities(data);
      } catch (err) {
        console.error("Không thể tải tỉnh/thành.");
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (!formData.cityCode) return;
    const fetchDistricts = async () => {
      try {
        const data = await getDistrictsByProvince(formData.cityCode);
        setDistricts(data);
      } catch (err) {
        console.error("Không thể tải quận/huyện.");
      }
    };
    fetchDistricts();
  }, [formData.cityCode]);

  useEffect(() => {
    if (!formData.districtCode) return;
    const fetchWards = async () => {
      try {
        const data = await getWardsByDistrict(formData.districtCode);
        setWards(data);
      } catch (err) {
        console.error("Không thể tải phường/xã.");
      }
    };
    fetchWards();
  }, [formData.districtCode]);

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
        <InputField
          icon={<MapPin />}
          label="Địa chỉ cụ thể"
          name="address"
          value={formData.address}
          onChange={onChange}
          required
        />
        <div className="grid md:grid-cols-3 gap-4">
          <SelectField
            label="Tỉnh/Thành phố"
            name="cityCode"
            value={formData.cityCode}
            onChange={onChange}
            required
            options={cities.map((city) => ({
              label: city.name,
              value: city.code,
            }))}
          />
          <SelectField
            label="Quận/Huyện"
            name="districtCode"
            value={formData.districtCode}
            onChange={onChange}
            required
            options={districts.map((district) => ({
              label: district.name,
              value: district.code,
            }))}
          />
          <SelectField
            label="Phường/Xã"
            name="wardCode"
            value={formData.wardCode}
            onChange={onChange}
            required
            options={wards.map((ward) => ({
              label: ward.name,
              value: ward.code,
            }))}
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
