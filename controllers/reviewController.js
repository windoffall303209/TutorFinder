const TutorReview = require("../models/tutorReview");
const dbPromise = require("../config/db");

// Lấy tất cả đánh giá của một gia sư
exports.getTutorReviews = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;

    // Lấy đánh giá
    const reviews = await TutorReview.getByTutorId(tutorId);

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error in reviewController.getTutorReviews:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi tải đánh giá",
    });
  }
};

// Kiểm tra xem người dùng đã đánh giá gia sư chưa
exports.checkUserReview = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;
    const userId = req.session.user.id;

    // Kiểm tra đánh giá
    const review = await TutorReview.getByUserAndTutor(userId, tutorId);

    res.status(200).json({
      success: true,
      hasReviewed: !!review,
      review,
    });
  } catch (error) {
    console.error("Error in reviewController.checkUserReview:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi kiểm tra đánh giá",
    });
  }
};

// Tạo đánh giá mới
exports.createReview = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;
    const userId = req.session.user.id;
    const { rating, comment } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Đánh giá không hợp lệ. Vui lòng chọn từ 1-5 sao.",
      });
    }

    // Kiểm tra xem người dùng đã đánh giá gia sư này chưa
    const existingReview = await TutorReview.getByUserAndTutor(userId, tutorId);

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message:
          "Bạn đã đánh giá gia sư này rồi. Vui lòng cập nhật đánh giá thay vì tạo mới.",
      });
    }

    // Tạo đánh giá mới
    await TutorReview.create(tutorId, userId, rating, comment);

    res.status(200).json({
      success: true,
      message: "Đánh giá thành công",
    });
  } catch (error) {
    console.error("Error in reviewController.createReview:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi tạo đánh giá",
    });
  }
};

// Cập nhật đánh giá
exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const tutorId = req.params.tutorId;
    const userId = req.session.user.id;
    const { rating, comment } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Đánh giá không hợp lệ. Vui lòng chọn từ 1-5 sao.",
      });
    }

    // Kiểm tra xem đánh giá có tồn tại không và có thuộc về người dùng hiện tại không
    const db = await dbPromise;
    const [reviews] = await db.query(
      "SELECT * FROM Tutor_Reviews WHERE id = ? AND user_id = ?",
      [reviewId, userId]
    );

    if (reviews.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật đánh giá này",
      });
    }

    // Cập nhật đánh giá
    await TutorReview.update(reviewId, tutorId, rating, comment);

    res.status(200).json({
      success: true,
      message: "Cập nhật đánh giá thành công",
    });
  } catch (error) {
    console.error("Error in reviewController.updateReview:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật đánh giá",
    });
  }
};

// Xóa đánh giá
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const tutorId = req.params.tutorId;
    const userId = req.session.user.id;

    // Kiểm tra xem đánh giá có tồn tại không và có thuộc về người dùng hiện tại không
    const db = await dbPromise;
    const [reviews] = await db.query(
      "SELECT * FROM Tutor_Reviews WHERE id = ? AND user_id = ?",
      [reviewId, userId]
    );

    if (reviews.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa đánh giá này",
      });
    }

    // Xóa đánh giá
    await TutorReview.delete(reviewId, tutorId);

    res.status(200).json({
      success: true,
      message: "Xóa đánh giá thành công",
    });
  } catch (error) {
    console.error("Error in reviewController.deleteReview:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi xóa đánh giá",
    });
  }
};

module.exports = exports;
