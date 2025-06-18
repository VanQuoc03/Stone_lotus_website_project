import { MapPin } from "lucide-react";
import React from "react";

export default function ShippingAddress({ address }) {
  if (!address) return null;
  return (
    <div className="bg-white rounded-md shadow p-4 text-sm">
      <div className="flex items-center gap-2 mb-3 font-bold text-2xl">
        <MapPin />
        <span>Địa chỉ giao hàng</span>
      </div>

      <div className="space-y-1">
        <p className="font-medium">{address.fullName || "(Không tên)"}</p>
        {address.phone && <p>{address.phone}</p>}
        {address.address && <p>{address.address}</p>}
        <p>
          {[address.ward, address.district, address.province]
            .filter(Boolean)
            .join(", ")}
        </p>
        {address.postalCode && <p>{address.postalCode}</p>}
      </div>
    </div>
  );
}
