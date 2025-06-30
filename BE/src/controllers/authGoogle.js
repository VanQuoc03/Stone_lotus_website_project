const { google } = require("googleapis");
const User = require("../models/user");
const { generateToken } = require("../utils/jwtUtils");

const oauth2 = google.oauth2("v2");

const googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu access token" });
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    const response = await oauth2.userinfo.get({ auth: oauth2Client });
    const { id: googleId, email, name, picture: avatar } = response.data;

    let user = await User.findOne({ googleId });

    if (!user) {
      // kiểm tra nếu có tài khoản email rồi thì gán thêm googleId
      user = await User.findOne({ email });

      if (user) {
        user.googleId = googleId;
        user.avatar = avatar;
        await user.save();
      } else {
        user = await User.create({
          googleId,
          email,
          name,
          avatar,
        });
      }
    }

    const jwtToken = generateToken(user);

    res.json({ success: true, token: jwtToken, customer: user }); // 👈 trả cả customer
  } catch (err) {
    console.error("Google access token invalid:", err.message);
    res
      .status(401)
      .json({ success: false, message: "Xác thực Google thất bại" });
  }
};

module.exports = {
  googleLogin,
};
