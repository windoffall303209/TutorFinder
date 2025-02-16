const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    subjects: {
      type: [String], // Mảng các môn học
      required: true,
    },
    levels: {
      type: [String], // Mảng các cấp lớp
      required: true,
    },
    location: {
      type: String,
    },
    bio: {
      type: String,
    },
    hourlyRate: {
      type: Number,
    },
  },
  { timestamps: true }
); // Thêm createdAt và updatedAt

const Tutor = mongoose.model("Tutor", tutorSchema);

module.exports = Tutor;
