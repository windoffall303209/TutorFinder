const mongoose = require("mongoose");
require("dotenv").config(); // Load biến môi trường

const DB_URL = process.env.DB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
  }
};

module.exports = connectDB;
