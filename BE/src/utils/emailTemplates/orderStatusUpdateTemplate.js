module.exports = function orderStatusUpdateTemplate({
  fullName,
  orderId,
  status,
  note,
}) {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
      <h2>Xin chào ${fullName},</h2>
      <p>Đơn hàng <strong>#${orderId}</strong> của bạn vừa được cập nhật trạng thái.</p>
      <p><strong>Trạng thái mới:</strong> ${status}</p>
      <p><strong>Ghi chú:</strong> ${note || "Không có ghi chú"}</p>
      <br/>
      <p>Cảm ơn bạn đã đồng hành cùng cửa hàng chúng tôi.</p>
      <p><em>Đội ngũ cửa hàng</em></p>
    </div>
  `;
};
