const Tutor = require("../models/tutor.model");

// Hiển thị danh sách gia sư
exports.index = async (req, res) => {
  try {
    const tutors = await Tutor.find();
    res.render("tutors/index", { tutors });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Hiển thị chi tiết một gia sư
exports.show = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).send("Tutor not found");
    }
    res.render("tutors/show", { tutor });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Hiển thị form tạo gia sư mới (GET)
exports.create = (req, res) => {
  res.render("tutors/create"); // Tạo file view `views/tutors/create.ejs`
};

// Xử lý tạo gia sư mới (POST)
exports.store = async (req, res) => {
  try {
    const newTutor = new Tutor(req.body);
    await newTutor.save();
    res.redirect("/tutors");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
};

// Các hàm khác (edit, update, delete) có thể được thêm vào sau
