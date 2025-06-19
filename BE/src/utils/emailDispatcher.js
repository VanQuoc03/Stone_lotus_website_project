const sendOrderEmail = require("./sendOrderEmail");
const orderConfirmationTemplate = require("./emailTemplates/orderConfirmation");
const orderStatusUpdateTemplate = require("./emailTemplates/orderStatusUpdateTemplate");

const dispatchEmail = async ({ type, order, note }) => {
  if (!order) throw new Error("Thiếu thông tin đơn hàng");

  const orderCode = order._id.toString().slice(-6).toUpperCase();
  const to = order.shipping_address.email;
  const fullName = order.shipping_address.fullName;

  if (type === "confirmation") {
    return sendOrderEmail({
      to,
      subject: `Xác nhận đơn hàng #${orderCode}`,
      html: orderConfirmationTemplate({
        fullName,
        orderId: orderCode,
        total: order.total_price,
        paymentMethod: order.payment_method,
      }),
    });
  }

  if (type === "status") {
    return sendOrderEmail({
      to,
      subject: `Cập nhật trạng thái đơn hàng #${orderCode}`,
      html: orderStatusUpdateTemplate({
        fullName,
        orderId: orderCode,
        status: order.status,
        note: note || `Cập nhật trạng thái thành ${order.status}`,
      }),
    });
  }
};

module.exports = dispatchEmail;
