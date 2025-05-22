const dbPromise = require("../config/db");

class TutorReview {
  // Lấy tất cả đánh giá của một gia sư
  static async getByTutorId(tutorId) {
    try {
      const db = await dbPromise;
      const [reviews] = await db.query(
        `SELECT tr.*, u.username, u.display_name
         FROM Tutor_Reviews tr
         JOIN Users u ON tr.user_id = u.id
         WHERE tr.tutor_id = ?
         ORDER BY tr.created_at DESC`,
        [tutorId]
      );
      return reviews;
    } catch (error) {
      console.error("Error in TutorReview.getByTutorId:", error);
      throw error;
    }
  }

  // Lấy đánh giá của một user cho một gia sư
  static async getByUserAndTutor(userId, tutorId) {
    try {
      const db = await dbPromise;
      const [review] = await db.query(
        "SELECT * FROM Tutor_Reviews WHERE user_id = ? AND tutor_id = ?",
        [userId, tutorId]
      );
      return review.length > 0 ? review[0] : null;
    } catch (error) {
      console.error("Error in TutorReview.getByUserAndTutor:", error);
      throw error;
    }
  }

  // Tạo đánh giá mới
  static async create(tutorId, userId, rating, comment) {
    try {
      const db = await dbPromise;
      const connection = await db.getConnection();

      try {
        await connection.beginTransaction();

        // Thêm đánh giá mới
        const [result] = await connection.query(
          "INSERT INTO Tutor_Reviews (tutor_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
          [tutorId, userId, rating, comment]
        );

        // Cập nhật điểm trung bình cho gia sư
        await this.updateTutorRating(connection, tutorId);

        await connection.commit();
        connection.release();
        return result.insertId;
      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error("Error in TutorReview.create:", error);
      throw error;
    }
  }

  // Cập nhật đánh giá
  static async update(id, tutorId, rating, comment) {
    try {
      const db = await dbPromise;
      const connection = await db.getConnection();

      try {
        await connection.beginTransaction();

        // Cập nhật đánh giá
        await connection.query(
          "UPDATE Tutor_Reviews SET rating = ?, comment = ?, updated_at = NOW() WHERE id = ?",
          [rating, comment, id]
        );

        // Cập nhật điểm trung bình cho gia sư
        await this.updateTutorRating(connection, tutorId);

        await connection.commit();
        connection.release();
        return true;
      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error("Error in TutorReview.update:", error);
      throw error;
    }
  }

  // Xóa đánh giá
  static async delete(id, tutorId) {
    try {
      const db = await dbPromise;
      const connection = await db.getConnection();

      try {
        await connection.beginTransaction();

        // Xóa đánh giá
        await connection.query("DELETE FROM Tutor_Reviews WHERE id = ?", [id]);

        // Cập nhật điểm trung bình cho gia sư
        await this.updateTutorRating(connection, tutorId);

        await connection.commit();
        connection.release();
        return true;
      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error("Error in TutorReview.delete:", error);
      throw error;
    }
  }

  // Cập nhật điểm trung bình cho gia sư
  static async updateTutorRating(connection, tutorId) {
    const [result] = await connection.query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as count
       FROM Tutor_Reviews 
       WHERE tutor_id = ?`,
      [tutorId]
    );

    const avgRating = result[0].avg_rating || 0;
    const count = result[0].count || 0;

    await connection.query(
      "UPDATE Tutors SET avg_rating = ?, review_count = ? WHERE id = ?",
      [avgRating, count, tutorId]
    );
  }
}

module.exports = TutorReview;
