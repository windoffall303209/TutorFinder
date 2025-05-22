const ClassRegistration = require("../models/classRegistration");
const Class = require("../models/class");
const Tutor = require("../models/tutor");
const dbPromise = require("../config/db");

// Xem danh sách đăng ký cho một lớp học (dành cho chủ lớp)
exports.getRegistrationsByClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    const userId = req.session.user.id;

    // Kiểm tra xem người dùng có phải là chủ lớp không
    const db = await dbPromise;
    const [classes] = await db.query(
      "SELECT * FROM Classes WHERE id = ? AND user_id = ?",
      [classId, userId]
    );

    if (classes.length === 0) {
      return res.status(403).render("error", {
        message: "Bạn không có quyền xem thông tin này",
        error: { status: 403 },
      });
    }

    // Lấy thông tin lớp học
    const classInfo = classes[0];

    // Lấy danh sách đăng ký
    const registrations = await ClassRegistration.getByClassId(classId);

    res.render("classes/registrations", {
      title: "Danh sách gia sư đăng ký",
      classInfo: classInfo,
      registrations: registrations,
    });
  } catch (error) {
    console.error(
      "Error in classRegistrationController.getRegistrationsByClass:",
      error
    );
    res.status(500).render("error", {
      message: "Đã xảy ra lỗi khi tải danh sách đăng ký",
      error,
    });
  }
};

// Xem danh sách đăng ký của một gia sư
exports.getRegistrationsByTutor = async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Lấy thông tin gia sư
    const db = await dbPromise;
    const [tutors] = await db.query("SELECT * FROM Tutors WHERE user_id = ?", [
      userId,
    ]);

    if (tutors.length === 0) {
      return res.status(403).render("error", {
        message: "Bạn chưa đăng ký làm gia sư",
        error: { status: 403 },
      });
    }

    const tutorId = tutors[0].id;

    // Lấy danh sách đăng ký
    const registrations = await ClassRegistration.getByTutorId(tutorId);

    res.render("tutors/my_registrations", {
      title: "Danh sách lớp đã đăng ký",
      registrations: registrations,
    });
  } catch (error) {
    console.error(
      "Error in classRegistrationController.getRegistrationsByTutor:",
      error
    );
    res.status(500).render("error", {
      message: "Đã xảy ra lỗi khi tải danh sách đăng ký",
      error,
    });
  }
};

// Đăng ký nhận lớp
exports.registerClass = async (req, res) => {
  try {
    const { classId, message } = req.body;
    const userId = req.session.user.id;

    // Kiểm tra xem người dùng có phải là gia sư không
    const db = await dbPromise;
    const [tutors] = await db.query("SELECT * FROM Tutors WHERE user_id = ?", [
      userId,
    ]);

    if (tutors.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Bạn chưa đăng ký làm gia sư",
      });
    }

    const tutorId = tutors[0].id;

    // Kiểm tra xem lớp học có tồn tại và còn đang mở không
    const [classes] = await db.query(
      "SELECT * FROM Classes WHERE id = ? AND status = 'open' AND is_active = 1",
      [classId]
    );

    if (classes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lớp học không tồn tại hoặc đã được nhận",
      });
    }

    // Kiểm tra xem gia sư đã đăng ký lớp này chưa
    const existingRegistration = await ClassRegistration.checkExists(
      classId,
      tutorId
    );

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đăng ký lớp học này rồi",
      });
    }

    // Tạo đăng ký mới
    await ClassRegistration.create(classId, tutorId, message);

    res.status(200).json({
      success: true,
      message: "Đăng ký thành công",
    });
  } catch (error) {
    console.error("Error in classRegistrationController.registerClass:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi đăng ký lớp học",
    });
  }
};

// Duyệt đăng ký
exports.approveRegistration = async (req, res) => {
  try {
    const registrationId = req.params.id;
    const userId = req.session.user.id;

    // Lấy thông tin đăng ký
    const db = await dbPromise;
    const [registrations] = await db.query(
      `SELECT cr.*, c.user_id as class_owner_id 
       FROM Class_Registrations cr
       JOIN Classes c ON cr.class_id = c.id
       WHERE cr.id = ?`,
      [registrationId]
    );

    if (registrations.length === 0) {
      return res.status(404).render("error", {
        message: "Không tìm thấy đăng ký",
        error: { status: 404 },
      });
    }

    // Kiểm tra xem người dùng có phải là chủ lớp không
    if (registrations[0].class_owner_id !== userId) {
      return res.status(403).render("error", {
        message: "Bạn không có quyền duyệt đăng ký này",
        error: { status: 403 },
      });
    }

    // Cập nhật trạng thái đăng ký
    await ClassRegistration.updateStatus(registrationId, "approved");

    res.redirect(`/classes/registrations/${registrations[0].class_id}`);
  } catch (error) {
    console.error(
      "Error in classRegistrationController.approveRegistration:",
      error
    );
    res.status(500).render("error", {
      message: "Đã xảy ra lỗi khi duyệt đăng ký",
      error,
    });
  }
};

// Từ chối đăng ký
exports.rejectRegistration = async (req, res) => {
  try {
    const registrationId = req.params.id;
    const userId = req.session.user.id;

    // Lấy thông tin đăng ký
    const db = await dbPromise;
    const [registrations] = await db.query(
      `SELECT cr.*, c.user_id as class_owner_id 
       FROM Class_Registrations cr
       JOIN Classes c ON cr.class_id = c.id
       WHERE cr.id = ?`,
      [registrationId]
    );

    if (registrations.length === 0) {
      return res.status(404).render("error", {
        message: "Không tìm thấy đăng ký",
        error: { status: 404 },
      });
    }

    // Kiểm tra xem người dùng có phải là chủ lớp không
    if (registrations[0].class_owner_id !== userId) {
      return res.status(403).render("error", {
        message: "Bạn không có quyền từ chối đăng ký này",
        error: { status: 403 },
      });
    }

    // Cập nhật trạng thái đăng ký
    await ClassRegistration.updateStatus(registrationId, "rejected");

    res.redirect(`/classes/registrations/${registrations[0].class_id}`);
  } catch (error) {
    console.error(
      "Error in classRegistrationController.rejectRegistration:",
      error
    );
    res.status(500).render("error", {
      message: "Đã xảy ra lỗi khi từ chối đăng ký",
      error,
    });
  }
};

module.exports = exports;
