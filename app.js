const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db");
const tutorsRoutes = require("./routes/tutors.routes"); // Import routes
const bodyParser = require("body-parser"); // Import body-parser
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
// Connect to MongoDB
connectDB();

// Cài đặt EJS làm template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware để phục vụ các file tĩnh (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Middleware để parse request body (cho form data)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sử dụng routes
app.use("/tutors", tutorsRoutes);
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});
app.post("/contact", (req, res) => {
  //TODO: Xử lý form, có thể gửi email
  console.log(req.body); // Dữ liệu từ form
  res.send("Cảm ơn bạn đã liên hệ!");
});

// Xử lý lỗi 404 (Not Found)
app.use((req, res, next) => {
  res.status(404).render("404"); // Tạo 1 file 404.ejs
});
// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
