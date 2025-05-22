const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const authMiddleware = require("../middleware/auth");

// Middleware xác thực
router.use(authMiddleware);

// Xem lịch học của một lớp
router.get("/class/:classId", scheduleController.getSchedulesByClass);

// Xem lịch học của gia sư
router.get("/tutor", scheduleController.getSchedulesByTutor);

// Tạo lịch học mới
router.post("/create", scheduleController.createSchedule);

// Xem chi tiết lịch học
router.get("/detail/:id", scheduleController.getScheduleDetail);

// Cập nhật trạng thái lịch học
router.post("/status/:id", scheduleController.updateScheduleStatus);

// Cập nhật trạng thái buổi học
router.post("/session/:id", scheduleController.updateSessionStatus);

module.exports = router;
