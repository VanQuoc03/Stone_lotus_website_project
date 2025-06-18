module.exports = function orderConfirmationEmail({
  fullName,
  orderId,
  paymentMethod,
}) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333">
      <h2>Chào ${fullName},</h2>
      <p>Chúng tôi đã nhận được đơn hàng của bạn.</p>
      <p><strong>Mã đơn hàng:</strong> ${orderId}</p>
      <p><strong>Phương thức thanh toán:</strong> ${
        paymentMethod === "bank" ? "Chuyển khoản" : "Thanh toán khi nhận hàng"
      }</p>
      <br/>
      <p>Chúng tôi sẽ liên hệ với bạn khi đơn hàng được giao cho đơn vị vận chuyển.</p>
      <p>Trân trọng,<br/>Cửa hàng</p>
    </div>
  `;
};
