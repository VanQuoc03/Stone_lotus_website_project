require("dotenv").config({ path: __dirname + "/../.env" });
console.log("Cloudinary Key:", process.env.CLOUDINARY_API_KEY); // ✅ phải in ra được

const express = require("express");
const loginRoute = require("./routes/login");
const signupRoute = require("../src/routes/signup");
const userRoute = require("./routes/user");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const createAdminAccount = require("../src/scripts/admin");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const PORT = process.env.PORT || 5000;
const uploadRoute = require("./routes/uploadRoute");

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000", // hoặc dùng "*" trong dev
    credentials: true,
  })
);
createAdminAccount();

app.use("/user", signupRoute);
app.use("/auth", loginRoute);
app.use("/api", userRoute);

//Category
app.use("/api/categories", categoryRoutes);

//Product
app.use("/api/products", productRoutes);

//UploadImage
app.use("/api/upload", uploadRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
