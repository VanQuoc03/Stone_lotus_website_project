const mongoose = require("../configuration/dbConfig");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer",
  },
  status: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  address: { type: String },

  googleId: { type: String, unique: true, sparse: true },
  avatar: String,
});

//Tự động hash mật khẩu nếu thay đổi
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
