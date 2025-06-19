module.exports = function orderStatusUpdateTemplate({
  fullName,
  orderId,
  status,
  note,
}) {
  const statusMap = {
    pending: "Đang chờ xác nhận",
    confirmed: "Đã xác nhận",
    processing: "Đang xử lý",
    shipped: "Đang giao",
    completed: "Đã giao",
    cancelled: "Đã hủy",
  };

  const statusColors = {
    "Đã hủy": "#e53935",
    "Đã giao": "#43a047",
    default: "#fb8c00",
  };

  const translatedStatus = statusMap[status] || status;
  const color =
    statusColors[translatedStatus] || statusColors.default;

  return `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; border: 1px solid #e0e0e0;">
      <h2 style="color: #333;">Xin chào ${fullName},</h2>
      <p>Đơn hàng <strong style="color: #555;">#${orderId}</strong> của bạn vừa được cập nhật trạng thái.</p>

      <p style="margin: 20px 0;">
        <span style="display: inline-block; font-weight: bold;">Trạng thái mới:</span><br/>
        <span style="font-size: 16px; font-weight: bold; color: ${color};">
          ${translatedStatus}
        </span>
      </p>

      <p><strong>Ghi chú:</strong> ${note || "Không có ghi chú"}</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

      <p style="color: #666;">Cảm ơn bạn đã đồng hành cùng cửa hàng chúng tôi.</p>
      <p style="color: #888;"><em>Đội ngũ cửa hàng</em></p>
    </div>
  </div>
  `;
};
