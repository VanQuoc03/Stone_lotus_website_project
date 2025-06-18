const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `Shop sen đá <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Đã gửi email đến:", to);
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error.message);
    throw new Error("Gửi email thất bại");
  }
};

module.exports = sendOrderEmail;
