import { MapPin, Phone, Mail } from "lucide-react";

export default function ShippingInfo({ shippingInfo }) {
  if (!shippingInfo) return null;
  const { fullName, phone, email, address, ward, district, city, note } =
    shippingInfo;
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5" />
        Thông tin giao hàng
      </h2>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <span className="font-medium">{fullName}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{phone}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{email}</span>
        </div>
        <div className="flex items-start gap-2 text-gray-600">
          <MapPin className="w-4 h-4 mt-1" />
          <div>
            {address && <p>{address}</p>}
            <p>
              {ward}, {district}
            </p>
            <p>{city}</p>
          </div>
        </div>
      </div>

      {note && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Ghi chú:</strong> {note}
          </p>
        </div>
      )}
    </div>
  );
}
