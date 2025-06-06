const dbPromise = require("../config/db");
const Tutor = require("../models/tutor");
const Subject = require("../models/subject");
const Grade = require("../models/grade");

// Lấy danh sách gia sư với phân trang và bộ lọc
exports.getTutors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;

    // Tạo đối tượng filters từ query params
    const filters = {
      search_name: req.query.search_name,
      subjects_teach: req.query.subjects_teach,
      classes_teach: req.query.classes_teach,
      gender: req.query.gender,
      education_level: req.query.education_level,
      district: req.query.district,
    };

    // Lấy tổng số gia sư thỏa mãn điều kiện tìm kiếm
    const totalCount = await Tutor.getSearchCount(filters);
    const totalPages = Math.ceil(totalCount / limit);

    // Lấy danh sách gia sư theo bộ lọc
    const tutors = await Tutor.search(filters, limit, offset);

    // Lấy danh sách môn học và khối lớp
    const [subjects] = await dbPromise.query(
      "SELECT * FROM subjects WHERE is_active = 1"
    );
    const [grades] = await dbPromise.query(
      "SELECT * FROM grades WHERE is_active = 1"
    );

    // Lấy danh sách quận/huyện từ các gia sư
    const [districts] = await dbPromise.query(
      "SELECT DISTINCT district FROM tutors WHERE district IS NOT NULL AND district != ''"
    );

    res.render("tutors/list", {
      title: "Danh sách gia sư",
      tutors,
      currentPage: page,
      totalPages,
      subjects,
      grades,
      districts,
      query: req.query,
    });
  } catch (error) {
    console.error("Error in getTutors:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Hiển thị chi tiết thông tin một gia sư
exports.getTutorDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const tutor = await Tutor.getById(id);
    if (!tutor) {
      return res.status(404).send("Tutor not found");
    }
    
    // Lấy đánh giá của gia sư
    const db = await dbPromise;
    const [reviews] = await db.query(
      `SELECT r.*, u.username as user_name 
       FROM Tutor_Ratings r
       JOIN Users u ON r.user_id = u.id
       WHERE r.tutor_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );
    
    // Tính điểm đánh giá trung bình
    let averageRating = 0;
    if (reviews && reviews.length > 0) {
      const sum = reviews.reduce((total, r) => total + r.rating, 0);
      averageRating = (sum / reviews.length).toFixed(1);
    }
    
    // Kiểm tra người dùng hiện tại đã đánh giá chưa
    let userReview = null;
    if (req.session.user) {
      const [userRatings] = await db.query(
        "SELECT * FROM Tutor_Ratings WHERE tutor_id = ? AND user_id = ?",
        [id, req.session.user.id]
      );
      
      if (userRatings && userRatings.length > 0) {
        userReview = userRatings[0];
      }
    }
    
    res.render("tutors/detail", {
      title: "Chi tiết gia sư",
      tutor,
      user: req.session.user,
      reviews,
      averageRating,
      userReview
    });
  } catch (error) {
    console.error("Error in getTutorDetail:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Xử lý đăng ký trở thành gia sư
exports.registerTutor = async (req, res) => {
  try {
    const {
      full_name,
      birth_year,
      gender,
      address,
      district,
      province,
      phone,
      education_level,
      introduction,
      subjectIds,
      gradeIds,
    } = req.body;

    // Validation cho số điện thoại
    if (!/^[0-9]{10}$/.test(phone)) {
      req.session.error = "Số điện thoại phải gồm đúng 10 chữ số";
      return res.redirect("/contact?error=phone");
    }

    // Validation cho năm sinh
    const birthYearNum = parseInt(birth_year);
    if (isNaN(birthYearNum) || birthYearNum < 1950 || birthYearNum > 2025) {
      req.session.error = "Năm sinh phải từ 1950 đến 2025";
      return res.redirect("/contact?error=birth_year");
    }

    // Xử lý file ảnh
    let photoName = null;
    if (req.file) {
      const fileExtension = req.file.originalname.split(".").pop();
      const newFileName = `${req.file.filename}.${fileExtension}`;
      const fs = require("fs");
      const oldPath = `public/uploads/${req.file.filename}`;
      const newPath = `public/uploads/${newFileName}`;

      // Đổi tên file để thêm phần mở rộng
      fs.renameSync(oldPath, newPath);
      photoName = newFileName;
    }

    const tutorData = {
      user_id: req.session.user.id,
      full_name,
      birth_year,
      gender,
      address,
      district,
      province,
      phone,
      education_level,
      introduction,
      photo: photoName,
    };

    const newTutor = await Tutor.create(tutorData, subjectIds, gradeIds);
    res.redirect("/tutors");
  } catch (error) {
    console.error("Error in registerTutor:", error);
    res.status(500).send("Internal Server Error");
  }
};
