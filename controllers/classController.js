const dbPromise = require("../config/db");
const Class = require("../models/class");
const Subject = require("../models/subject");
const Grade = require("../models/grade");

// Lấy danh sách lớp học với phân trang và bộ lọc
exports.getClasses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;

    // Tạo đối tượng filters từ query params
    const filters = {
      search_name: req.query.search_name,
      subject_id: req.query.subject_id,
      grade_id: req.query.grade_id,
      learning_mode: req.query.learning_mode,
      district: req.query.district,
    };

    // Lấy tổng số lớp học thỏa mãn điều kiện tìm kiếm
    const totalCount = await Class.getSearchCount(filters);
    const totalPages = Math.ceil(totalCount / limit);

    // Lấy danh sách lớp theo bộ lọc
    const classes = await Class.search(filters, limit, offset);

    // Lấy danh sách môn học và khối lớp
    const [subjects] = await dbPromise.query(
      "SELECT * FROM subjects WHERE is_active = 1"
    );
    const [grades] = await dbPromise.query(
      "SELECT * FROM grades WHERE is_active = 1"
    );

    // Lấy danh sách quận/huyện từ các lớp học
    const [districts] = await dbPromise.query(
      "SELECT DISTINCT district FROM classes WHERE status = 'open' AND is_active = 1 AND district IS NOT NULL AND district != ''"
    );

    res.render("classes/list", {
      title: "Danh sách lớp học",
      classes,
      currentPage: page,
      totalPages,
      subjects,
      grades,
      districts,
      query: req.query,
    });
  } catch (error) {
    console.error("Error in getClasses:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Hiển thị chi tiết thông tin một lớp học
exports.getClassDetail = async (req, res) => {
  const id = req.params.id;
  try {
    const classObj = await Class.getById(id);
    if (!classObj) return res.status(404).send("Lớp học không tồn tại");

    res.render("classes/detail", {
      title: "Chi tiết lớp học",
      classObj,
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Xử lý đăng ký lớp học mới
exports.registerClass = async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");

  try {
    const {
      parent_name,
      phone,
      district,
      province,
      specific_address,
      subject_id,
      grade_id,
      tutor_gender,
      sessions_per_week,
      fee_per_session,
      description,
      learning_mode,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (
      !parent_name ||
      !phone ||
      !district ||
      !province ||
      !specific_address ||
      !subject_id ||
      !grade_id ||
      !tutor_gender ||
      !sessions_per_week ||
      !fee_per_session ||
      !description ||
      !learning_mode
    ) {
      // Lấy danh sách môn học và khối lớp để điền lại form
      const db = await dbPromise;
      const [subjects] = await db.query("SELECT * FROM subjects WHERE is_active = 1");
      const [grades] = await db.query("SELECT * FROM grades WHERE is_active = 1");
      
      return res.render("contact/index", {
        title: "Đăng ký lớp học",
        user: req.session.user,
        error: "Vui lòng điền đầy đủ thông tin lớp học",
        subjects,
        grades,
        formType: "class"
      });
    }

    // Validation số điện thoại
    if (!/^[0-9]{10}$/.test(phone)) {
      const db = await dbPromise;
      const [subjects] = await db.query("SELECT * FROM subjects WHERE is_active = 1");
      const [grades] = await db.query("SELECT * FROM grades WHERE is_active = 1");
      
      return res.render("contact/index", {
        title: "Đăng ký lớp học",
        user: req.session.user,
        error: "Số điện thoại phải gồm đúng 10 chữ số",
        subjects,
        grades,
        formType: "class"
      });
    }

    // Validation số buổi/tuần
    const sessionsPerWeek = parseInt(sessions_per_week, 10);
    if (isNaN(sessionsPerWeek) || sessionsPerWeek < 1 || sessionsPerWeek > 20) {
      const db = await dbPromise;
      const [subjects] = await db.query("SELECT * FROM subjects WHERE is_active = 1");
      const [grades] = await db.query("SELECT * FROM grades WHERE is_active = 1");
      
      return res.render("contact/index", {
        title: "Đăng ký lớp học",
        user: req.session.user,
        error: "Số buổi/tuần phải từ 1 đến 20",
        subjects,
        grades,
        formType: "class"
      });
    }

    // Validation học phí
    const feePerSession = parseFloat(fee_per_session);
    if (isNaN(feePerSession) || feePerSession < 10000 || feePerSession > 10000000) {
      const db = await dbPromise;
      const [subjects] = await db.query("SELECT * FROM subjects WHERE is_active = 1");
      const [grades] = await db.query("SELECT * FROM grades WHERE is_active = 1");
      
      return res.render("contact/index", {
        title: "Đăng ký lớp học",
        user: req.session.user,
        error: "Học phí phải từ 10,000 đến 10,000,000 VNĐ",
        subjects,
        grades,
        formType: "class"
      });
    }

    const db = await dbPromise;

    // Validation sessions_per_week và fee_per_session đã được thực hiện ở trên
    // Chuyển đổi sessions_per_week và fee_per_session thành số
    const validatedSessionsPerWeek = parseInt(sessions_per_week, 10);
    const validatedFeePerSession = parseFloat(fee_per_session);

    if (isNaN(validatedSessionsPerWeek) || isNaN(validatedFeePerSession)) {
      const [subjects] = await db.query("SELECT * FROM subjects WHERE is_active = 1");
      const [grades] = await db.query("SELECT * FROM grades WHERE is_active = 1");
      
      return res.render("contact/index", {
        title: "Đăng ký lớp học",
        user: req.session.user,
        error: "Số buổi/tuần và học phí phải là số",
        subjects,
        grades,
        formType: "class",
      });
    }

    const classData = {
      user_id: req.session.user.id,
      parent_name,
      phone,
      district,
      province,
      specific_address,
      subject_id,
      grade_id,
      tutor_gender,
      sessions_per_week: validatedSessionsPerWeek,
      fee_per_session: validatedFeePerSession,
      description,
      learning_mode,
      status: "open",
      is_active: 1
    };

    // Thêm lớp học mới vào cơ sở dữ liệu
    const [result] = await db.query(
      `INSERT INTO classes (
        user_id, parent_name, phone, district, province, specific_address,
        subject_id, grade_id, tutor_gender, sessions_per_week, fee_per_session,
        description, learning_mode, status, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        classData.user_id, classData.parent_name, classData.phone,
        classData.district, classData.province, classData.specific_address,
        classData.subject_id, classData.grade_id, classData.tutor_gender,
        classData.sessions_per_week, classData.fee_per_session,
        classData.description, classData.learning_mode, classData.status, classData.is_active
      ]
    );

    if (result.affectedRows > 0) {
      return res.redirect("/user/classes/created");
    } else {
      throw new Error("Không thể thêm lớp học mới");
    }
  } catch (error) {
    console.error("Error in registerClass:", error);
    
    // Lấy danh sách môn học và khối lớp để điền lại form
    const db = await dbPromise;
    const [subjects] = await db.query("SELECT * FROM subjects WHERE is_active = 1");
    const [grades] = await db.query("SELECT * FROM grades WHERE is_active = 1");
    
    res.render("contact/index", {
      title: "Đăng ký lớp học",
      user: req.session.user,
      error: "Đã xảy ra lỗi: " + error.message,
      subjects,
      grades,
      formType: "class",
    });
  }
};
