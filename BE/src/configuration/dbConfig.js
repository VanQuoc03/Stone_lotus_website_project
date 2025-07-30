require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB Atlas");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to MongoDB", err);
});
module.exports = mongoose;
