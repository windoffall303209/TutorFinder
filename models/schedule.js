const dbPromise = require("../config/db");

class Schedule {
  // Lấy lịch học của một lớp
  static async getByClassId(classId) {
    try {
      const db = await dbPromise;
      const [schedules] = await db.query(
        `SELECT s.*, t.full_name as tutor_name, c.parent_name, c.subject_id, c.grade_id, 
                sub.name as subject_name, g.name as grade_name
         FROM Schedules s
         JOIN Tutors t ON s.tutor_id = t.id
         JOIN Classes c ON s.class_id = c.id
         JOIN Subjects sub ON c.subject_id = sub.id
         JOIN Grades g ON c.grade_id = g.id
         WHERE s.class_id = ?
         ORDER BY s.start_date DESC`,
        [classId]
      );

      // Lấy chi tiết lịch học
      for (let schedule of schedules) {
        const [details] = await db.query(
          "SELECT * FROM Schedule_Details WHERE schedule_id = ? ORDER BY day_of_week, start_time",
          [schedule.id]
        );
        schedule.details = details;
      }

      return schedules;
    } catch (error) {
      console.error("Error in Schedule.getByClassId:", error);
      throw error;
    }
  }

  // Lấy lịch học của một gia sư
  static async getByTutorId(tutorId) {
    try {
      const db = await dbPromise;
      const [schedules] = await db.query(
        `SELECT s.*, c.parent_name, c.subject_id, c.grade_id, 
                sub.name as subject_name, g.name as grade_name, c.district, c.province
         FROM Schedules s
         JOIN Classes c ON s.class_id = c.id
         JOIN Subjects sub ON c.subject_id = sub.id
         JOIN Grades g ON c.grade_id = g.id
         WHERE s.tutor_id = ?
         ORDER BY s.start_date DESC`,
        [tutorId]
      );

      // Lấy chi tiết lịch học
      for (let schedule of schedules) {
        const [details] = await db.query(
          "SELECT * FROM Schedule_Details WHERE schedule_id = ? ORDER BY day_of_week, start_time",
          [schedule.id]
        );
        schedule.details = details;
      }

      return schedules;
    } catch (error) {
      console.error("Error in Schedule.getByTutorId:", error);
      throw error;
    }
  }

  // Tạo lịch học mới
  static async create(scheduleData, scheduleDetails) {
    try {
      const db = await dbPromise;
      const connection = await db.getConnection();

      try {
        await connection.beginTransaction();

        // Thêm thông tin lịch học
        const [result] = await connection.query(
          "INSERT INTO Schedules SET ?",
          scheduleData
        );
        const scheduleId = result.insertId;

        // Thêm chi tiết lịch học
        if (scheduleDetails && scheduleDetails.length > 0) {
          for (let detail of scheduleDetails) {
            detail.schedule_id = scheduleId;
            await connection.query(
              "INSERT INTO Schedule_Details SET ?",
              detail
            );
          }
        }

        // Tạo các buổi học cụ thể cho 1 tháng đầu tiên
        await this.generateInitialSessions(
          connection,
          scheduleId,
          scheduleData.start_date
        );

        await connection.commit();
        connection.release();
        return scheduleId;
      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error("Error in Schedule.create:", error);
      throw error;
    }
  }

  // Tạo các buổi học cụ thể dựa trên lịch học
  static async generateInitialSessions(connection, scheduleId, startDate) {
    // Lấy chi tiết lịch học
    const [details] = await connection.query(
      "SELECT * FROM Schedule_Details WHERE schedule_id = ?",
      [scheduleId]
    );

    if (!details || details.length === 0) return;

    // Tạo các buổi học cho 4 tuần đầu tiên
    const start = new Date(startDate);
    const end = new Date(startDate);
    end.setDate(end.getDate() + 28); // 4 tuần

    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay(); // 0: CN, 1-6: T2-T7

      // Tìm chi tiết lịch học cho ngày trong tuần
      const matchingDetails = details.filter(
        (d) => d.day_of_week === dayOfWeek
      );

      for (let detail of matchingDetails) {
        // Tạo buổi học
        await connection.query(
          `INSERT INTO Schedule_Sessions 
           (schedule_id, session_date, start_time, end_time, status) 
           VALUES (?, ?, ?, ?, 'scheduled')`,
          [scheduleId, currentDate, detail.start_time, detail.end_time]
        );
      }

      // Sang ngày tiếp theo
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // Lấy chi tiết lịch học
  static async getById(id) {
    try {
      const db = await dbPromise;
      const [schedules] = await db.query(
        `SELECT s.*, t.full_name as tutor_name, c.parent_name, c.subject_id, c.grade_id, 
                sub.name as subject_name, g.name as grade_name
         FROM Schedules s
         JOIN Tutors t ON s.tutor_id = t.id
         JOIN Classes c ON s.class_id = c.id
         JOIN Subjects sub ON c.subject_id = sub.id
         JOIN Grades g ON c.grade_id = g.id
         WHERE s.id = ?`,
        [id]
      );

      if (schedules.length === 0) return null;

      const schedule = schedules[0];

      // Lấy chi tiết lịch học
      const [details] = await db.query(
        "SELECT * FROM Schedule_Details WHERE schedule_id = ? ORDER BY day_of_week, start_time",
        [id]
      );
      schedule.details = details;

      // Lấy các buổi học
      const [sessions] = await db.query(
        "SELECT * FROM Schedule_Sessions WHERE schedule_id = ? ORDER BY session_date, start_time",
        [id]
      );
      schedule.sessions = sessions;

      return schedule;
    } catch (error) {
      console.error("Error in Schedule.getById:", error);
      throw error;
    }
  }

  // Cập nhật trạng thái lịch học
  static async updateStatus(id, status) {
    try {
      const db = await dbPromise;
      await db.query("UPDATE Schedules SET status = ? WHERE id = ?", [
        status,
        id,
      ]);
      return true;
    } catch (error) {
      console.error("Error in Schedule.updateStatus:", error);
      throw error;
    }
  }
  // Lấy các buổi học sắp tới của gia sư
  static async getUpcomingSessions(tutorId, limit = 10) {
    try {
      const db = await dbPromise;
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      const timeStr = now.toTimeString().split(" ")[0];

      const [sessions] = await db.query(
        `SELECT ss.*, s.class_id, c.parent_name, c.district, c.province, 
                sub.name as subject_name, g.name as grade_name
         FROM Schedule_Sessions ss
         JOIN Schedules s ON ss.schedule_id = s.id
         JOIN Classes c ON s.class_id = c.id
         JOIN Subjects sub ON c.subject_id = sub.id
         JOIN Grades g ON c.grade_id = g.id
         WHERE s.tutor_id = ? AND 
               ((ss.date = ? AND ss.start_time > ?) OR ss.date > ?) AND
               ss.status = 'upcoming'
         ORDER BY ss.date, ss.start_time
         LIMIT ?`,
        [tutorId, dateStr, timeStr, dateStr, limit]
      );

      return sessions;
    } catch (error) {
      console.error("Error in Schedule.getUpcomingSessions:", error);
      throw error;
    }
  }
  
  // Tạo thêm buổi học dựa trên lịch học hàng tuần
  static async generateSessions(scheduleId, details, lastDate, numSessions) {
    try {
      const db = await dbPromise;
      const connection = await db.getConnection();
      
      try {
        await connection.beginTransaction();
        
        // Tính ngày bắt đầu (ngày sau buổi học cuối cùng)
        const startDate = new Date(lastDate);
        startDate.setDate(startDate.getDate() + 1);
        
        // Tạo buổi học
        let sessionsCreated = 0;
        let currentDate = new Date(startDate);
        
        while (sessionsCreated < numSessions) {
          const dayOfWeek = currentDate.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ...
          
          // Tìm lịch học phù hợp cho ngày trong tuần
          for (const detail of details) {
            if (parseInt(detail.day_of_week) === dayOfWeek) {
              // Tạo buổi học mới
              const dateStr = currentDate.toISOString().split('T')[0];
              
              await connection.query(
                `INSERT INTO Schedule_Sessions 
                 (schedule_id, date, start_time, end_time, status) 
                 VALUES (?, ?, ?, ?, 'upcoming')`,
                [scheduleId, dateStr, detail.start_time, detail.end_time]
              );
              
              sessionsCreated++;
              
              // Nếu đã đủ số buổi học cần tạo, thoát khỏi vòng lặp
              if (sessionsCreated >= numSessions) {
                break;
              }
            }
          }
          
          // Tăng ngày lên 1
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Cập nhật số buổi học của lịch
        await connection.query(
          `UPDATE Schedules 
           SET session_count = (
             SELECT COUNT(*) FROM Schedule_Sessions 
             WHERE schedule_id = ?
           ) 
           WHERE id = ?`,
          [scheduleId, scheduleId]
        );
        
        await connection.commit();
        return true;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Error in Schedule.generateSessions:", error);
      throw error;
    }
  }
}

module.exports = Schedule;
