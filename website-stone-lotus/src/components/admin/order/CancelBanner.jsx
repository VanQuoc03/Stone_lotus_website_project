import dayjs from "dayjs";
import React from "react";

export default function CancelBanner({ cancelledAt, cancelledBy, reason }) {
  return (
    <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded">
      <p className="font-semibold">❌ Đơn hàng đã bị hủy</p>
      <p>
        Đơn hàng bị hủy vào lúc{" "}
        <strong>
          {cancelledAt
            ? dayjs(cancelledAt).format("DD/MM/YYYY HH:mm")
            : "không xác định"}
        </strong>{" "}
        bởi {cancelledBy || "Admin"}.
      </p>
      <p>Lý do: {reason || "Không có lý do cụ thể."}</p>
    </div>
  );
}
