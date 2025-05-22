const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/auth");

// Middleware xác thực
router.use(authMiddleware);

// Lấy tất cả đánh giá của một gia sư
router.get("/tutor/:tutorId", reviewController.getTutorReviews);

// Kiểm tra xem người dùng đã đánh giá gia sư chưa
router.get("/check/:tutorId", reviewController.checkUserReview);

// Tạo đánh giá mới
router.post("/create/:tutorId", reviewController.createReview);

// Cập nhật đánh giá
router.put("/update/:id/:tutorId", reviewController.updateReview);

// Xóa đánh giá
router.delete("/delete/:id/:tutorId", reviewController.deleteReview);

module.exports = router;
