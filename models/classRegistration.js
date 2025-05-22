const dbPromise = require("../config/db");

class ClassRegistration {
  // Lấy danh sách đăng ký của một lớp
  static async getByClassId(classId) {
    try {
      const db = await dbPromise;
      const [registrations] = await db.query(
        `SELECT cr.*, t.full_name as tutor_name, u.username as username
        FROM Class_Registrations cr
        JOIN Tutors t ON cr.tutor_id = t.id
        JOIN Users u ON t.user_id = u.id
        WHERE cr.class_id = ?
        ORDER BY cr.created_at DESC`,
        [classId]
      );
      return registrations;
    } catch (error) {
      console.error("Error in ClassRegistration.getByClassId:", error);
      throw error;
    }
  }

  // Lấy danh sách đăng ký của một gia sư
  static async getByTutorId(tutorId) {
    try {
      const db = await dbPromise;
      const [registrations] = await db.query(
        `SELECT cr.*, c.subject_id, c.grade_id, c.parent_name, c.district, c.province, 
               c.fee_per_session, c.sessions_per_week, s.name as subject_name, g.name as grade_name
        FROM Class_Registrations cr
        JOIN Classes c ON cr.class_id = c.id
        JOIN Subjects s ON c.subject_id = s.id
        JOIN Grades g ON c.grade_id = g.id
        WHERE cr.tutor_id = ?
        ORDER BY cr.created_at DESC`,
        [tutorId]
      );
      return registrations;
    } catch (error) {
      console.error("Error in ClassRegistration.getByTutorId:", error);
      throw error;
    }
  }

  // Kiểm tra xem gia sư đã đăng ký lớp này chưa
  static async checkExists(classId, tutorId) {
    try {
      const db = await dbPromise;
      const [result] = await db.query(
        "SELECT * FROM Class_Registrations WHERE class_id = ? AND tutor_id = ?",
        [classId, tutorId]
      );
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error("Error in ClassRegistration.checkExists:", error);
      throw error;
    }
  }

  // Tạo đăng ký mới
  static async create(classId, tutorId, message) {
    try {
      const db = await dbPromise;
      const [result] = await db.query(
        "INSERT INTO Class_Registrations (class_id, tutor_id, message) VALUES (?, ?, ?)",
        [classId, tutorId, message]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error in ClassRegistration.create:", error);
      throw error;
    }
  }

  // Cập nhật trạng thái đăng ký
  static async updateStatus(id, status) {
    try {
      const db = await dbPromise;
      await db.query("UPDATE Class_Registrations SET status = ? WHERE id = ?", [
        status,
        id,
      ]);

      // Nếu chấp nhận đăng ký, cập nhật lớp học và từ chối các đăng ký khác
      if (status === "approved") {
        const [registration] = await db.query(
          "SELECT * FROM Class_Registrations WHERE id = ?",
          [id]
        );

        if (registration.length > 0) {
          const { class_id, tutor_id } = registration[0];

          // Cập nhật lớp học với thông tin gia sư được chấp nhận
          await db.query(
            "UPDATE Classes SET status = 'taken', assigned_tutor_id = ? WHERE id = ?",
            [tutor_id, class_id]
          );

          // Từ chối các đăng ký khác
          await db.query(
            "UPDATE Class_Registrations SET status = 'rejected' WHERE class_id = ? AND id != ?",
            [class_id, id]
          );
        }
      }

      return true;
    } catch (error) {
      console.error("Error in ClassRegistration.updateStatus:", error);
      throw error;
    }
  }
}

module.exports = ClassRegistration;
