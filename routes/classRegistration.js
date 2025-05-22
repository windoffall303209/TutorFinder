const express = require("express");
const router = express.Router();
const classRegistrationController = require("../controllers/classRegistrationController");
const authMiddleware = require("../middleware/auth");

// Middleware xác thực
router.use(authMiddleware);

// Xem danh sách đăng ký cho một lớp học (dành cho chủ lớp)
router.get(
  "/class/:classId",
  classRegistrationController.getRegistrationsByClass
);

// Xem danh sách đăng ký của một gia sư
router.get("/tutor", classRegistrationController.getRegistrationsByTutor);

// Đăng ký nhận lớp
router.post("/register", classRegistrationController.registerClass);

// Duyệt đăng ký
router.post("/approve/:id", classRegistrationController.approveRegistration);

// Từ chối đăng ký
router.post("/reject/:id", classRegistrationController.rejectRegistration);

module.exports = router;
