const Schedule = require("../models/schedule");
const dbPromise = require("../config/db");

// Xem lịch học của một lớp
exports.getSchedulesByClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    const userId = req.session.user.id;

    // Kiểm tra quyền truy cập (chủ lớp hoặc gia sư được chỉ định)
    const db = await dbPromise;
    const [classes] = await db.query(
      `SELECT c.*, t.user_id as tutor_user_id 
       FROM Classes c 
       LEFT JOIN Tutors t ON c.assigned_tutor_id = t.id 
       WHERE c.id = ?`,
      [classId]
    );

    if (classes.length === 0) {
      return res.status(404).render("error", {
        message: "Không tìm thấy lớp học",
        error: { status: 404 },
      });
    }

    const classInfo = classes[0];

    // Kiểm tra quyền truy cập
    if (classInfo.user_id !== userId && classInfo.tutor_user_id !== userId) {
      return res.status(403).render("error", {
        message: "Bạn không có quyền xem lịch học này",
        error: { status: 403 },
      });
    }

    // Lấy danh sách lịch học
    const schedules = await Schedule.getByClassId(classId);

    res.render("classes/schedules", {
      title: "Lịch học",
      classInfo: classInfo,
      schedules: schedules,
      isClassOwner: classInfo.user_id === userId,
    });
  } catch (error) {
    console.error("Error in scheduleController.getSchedulesByClass:", error);
    res.status(500).render("error", {
      message: "Đã xảy ra lỗi khi tải lịch học",
      error,
    });
  }
};

// Xem lịch học của gia sư
exports.getSchedulesByTutor = async (req, res) => {
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

    // Lấy danh sách lịch học
    const schedules = await Schedule.getByTutorId(tutorId);

    // Lấy danh sách buổi học sắp tới
    const upcomingSessions = await Schedule.getUpcomingSessions(tutorId, 10);

    res.render("tutors/my_schedules", {
      title: "Lịch học của tôi",
      schedules: schedules,
      upcomingSessions: upcomingSessions,
    });
  } catch (error) {
    console.error("Error in scheduleController.getSchedulesByTutor:", error);
    res.status(500).render("error", {
      message: "Đã xảy ra lỗi khi tải lịch học",
      error,
    });
  }
};

// Tạo lịch học mới
exports.createSchedule = async (req, res) => {
  try {
    const { classId, startDate, scheduleDetails } = req.body;
    const userId = req.session.user.id;

    // Kiểm tra quyền truy cập (là chủ lớp học)
    const db = await dbPromise;
    const [classes] = await db.query(
      "SELECT * FROM Classes WHERE id = ? AND user_id = ?",
      [classId, userId]
    );

    if (classes.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền tạo lịch học cho lớp này",
      });
    }

    const classInfo = classes[0];

    // Kiểm tra xem lớp đã được gán cho gia sư chưa
    if (!classInfo.assigned_tutor_id) {
      return res.status(400).json({
        success: false,
        message: "Lớp học chưa được gán cho gia sư nào",
      });
    }

    // Tạo dữ liệu cho lịch học
    const scheduleData = {
      class_id: classId,
      tutor_id: classInfo.assigned_tutor_id,
      start_date: startDate,
      status: "active",
    };

    // Chuyển đổi dữ liệu chi tiết lịch học
    const details = JSON.parse(scheduleDetails);

    // Tạo lịch học
    const scheduleId = await Schedule.create(scheduleData, details);

    res.status(200).json({
      success: true,
      message: "Tạo lịch học thành công",
      scheduleId,
    });
  } catch (error) {
    console.error("Error in scheduleController.createSchedule:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi tạo lịch học",
    });
  }
};

// Xem chi tiết lịch học
exports.getScheduleDetail = async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const userId = req.session.user.id;

    // Lấy thông tin lịch học
    const schedule = await Schedule.getById(scheduleId);

    if (!schedule) {
      return res.status(404).render("error", {
        message: "Không tìm thấy lịch học",
        error: { status: 404 },
      });
    }

    // Kiểm tra quyền truy cập
    const db = await dbPromise;
    const [classInfo] = await db.query("SELECT * FROM Classes WHERE id = ?", [
      schedule.class_id,
    ]);

    const [tutorInfo] = await db.query("SELECT * FROM Tutors WHERE id = ?", [
      schedule.tutor_id,
    ]);

    // Kiểm tra xem người dùng có phải là chủ lớp hoặc gia sư không
    if (classInfo[0].user_id !== userId && tutorInfo[0].user_id !== userId) {
      return res.status(403).render("error", {
        message: "Bạn không có quyền xem lịch học này",
        error: { status: 403 },
      });
    }

    res.render("classes/schedule_detail", {
      title: "Chi tiết lịch học",
      schedule,
      isClassOwner: classInfo[0].user_id === userId,
      isTutor: tutorInfo[0].user_id === userId,
    });
  } catch (error) {
    console.error("Error in scheduleController.getScheduleDetail:", error);
    res.status(500).render("error", {
      message: "Đã xảy ra lỗi khi tải chi tiết lịch học",
      error,
    });
  }
};

// Cập nhật trạng thái lịch học
exports.updateScheduleStatus = async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const { status } = req.body;
    const userId = req.session.user.id;

    // Kiểm tra quyền truy cập
    const db = await dbPromise;
    const [schedules] = await db.query(
      `SELECT s.*, c.user_id as class_owner_id 
       FROM Schedules s
       JOIN Classes c ON s.class_id = c.id
       WHERE s.id = ?`,
      [scheduleId]
    );

    if (schedules.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch học",
      });
    }

    // Chỉ chủ lớp mới có quyền cập nhật trạng thái
    if (schedules[0].class_owner_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật trạng thái lịch học này",
      });
    }

    // Cập nhật trạng thái
    await Schedule.updateStatus(scheduleId, status);

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái thành công",
    });
  } catch (error) {
    console.error("Error in scheduleController.updateScheduleStatus:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật trạng thái lịch học",
    });
  }
};

// Cập nhật trạng thái buổi học
exports.updateSessionStatus = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { status, attendance, note } = req.body;
    const userId = req.session.user.id;

    // Kiểm tra quyền truy cập
    const db = await dbPromise;
    const [sessions] = await db.query(
      `SELECT ss.*, s.tutor_id, t.user_id as tutor_user_id
       FROM Schedule_Sessions ss
       JOIN Schedules s ON ss.schedule_id = s.id
       JOIN Tutors t ON s.tutor_id = t.id
       WHERE ss.id = ?`,
      [sessionId]
    );

    if (sessions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy buổi học",
      });
    }

    // Chỉ gia sư được gán cho lớp học mới có quyền cập nhật buổi học
    if (sessions[0].tutor_user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật buổi học này",
      });
    }

    // Cập nhật trạng thái buổi học
    await db.query(
      `UPDATE Schedule_Sessions 
       SET status = ?, attendance = ?, note = ? 
       WHERE id = ?`,
      [status, attendance, note, sessionId]
    );

    res.status(200).json({
      success: true,
      message: "Cập nhật buổi học thành công",
    });
  } catch (error) {
    console.error("Error in scheduleController.updateSessionStatus:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật buổi học",
    });
  }
};

// Form báo cáo buổi học
exports.getReportSessionForm = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.session.user.id;

    // Lấy thông tin buổi học
    const db = await dbPromise;
    const [sessions] = await db.query(
      `SELECT ss.*, s.id as schedule_id, s.tutor_id, t.user_id as tutor_user_id, 
              t.full_name as tutor_name, t.phone as tutor_phone,
              c.parent_name as student_name, c.specific_address as address,
              c.subject_id, c.grade_id, sub.name as subject_name, g.name as grade_name
       FROM Schedule_Sessions ss
       JOIN Schedules s ON ss.schedule_id = s.id
       JOIN Tutors t ON s.tutor_id = t.id
       JOIN Classes c ON s.class_id = c.id
       JOIN Subjects sub ON c.subject_id = sub.id
       JOIN Grades g ON c.grade_id = g.id
       WHERE ss.id = ?`,
      [sessionId]
    );

    if (sessions.length === 0) {
      return res.status(404).render("error", {
        message: "Không tìm thấy buổi học",
        error: { status: 404 },
      });
    }

    const session = sessions[0];

    // Kiểm tra quyền truy cập (phải là gia sư được gán)
    if (session.tutor_user_id !== userId) {
      return res.status(403).render("error", {
        message: "Bạn không có quyền báo cáo buổi học này",
        error: { status: 403 },
      });
    }

    // Lấy báo cáo hiện tại nếu có
    const [reports] = await db.query(
      "SELECT * FROM Session_Reports WHERE session_id = ?",
      [sessionId]
    );

    if (reports.length > 0) {
      session.report = reports[0];
    }

    res.render("schedules/report-session", {
      title: "Báo cáo buổi học",
      session,
    });
  } catch (error) {
    console.error("Error in scheduleController.getReportSessionForm:", error);
    res.status(500).render("error", {
      message: "Đã xảy ra lỗi khi tải form báo cáo",
      error,
    });
  }
};

// Gửi báo cáo buổi học
exports.submitSessionReport = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const {
      attendance,
      topics,
      homework,
      student_performance,
      notes,
      status,
    } = req.body;
    const userId = req.session.user.id;

    // Kiểm tra quyền truy cập
    const db = await dbPromise;
    const [sessions] = await db.query(
      `SELECT ss.*, s.id as schedule_id, s.tutor_id, t.user_id as tutor_user_id 
       FROM Schedule_Sessions ss
       JOIN Schedules s ON ss.schedule_id = s.id
       JOIN Tutors t ON s.tutor_id = t.id
       WHERE ss.id = ?`,
      [sessionId]
    );

    if (sessions.length === 0) {
      return res.status(404).render("error", {
        message: "Không tìm thấy buổi học",
        error: { status: 404 },
      });
    }

    // Kiểm tra quyền truy cập (phải là gia sư được gán)
    if (sessions[0].tutor_user_id !== userId) {
      return res.status(403).render("error", {
        message: "Bạn không có quyền báo cáo buổi học này",
        error: { status: 403 },
      });
    }

    // Kiểm tra xem đã có báo cáo cho buổi học này chưa
    const [reports] = await db.query(
      "SELECT * FROM Session_Reports WHERE session_id = ?",
      [sessionId]
    );

    if (reports.length > 0) {
      return res.status(400).render("error", {
        message: "Buổi học này đã có báo cáo. Vui lòng sử dụng chức năng cập nhật.",
        error: { status: 400 },
      });
    }

    // Tạo báo cáo mới
    await db.query(
      `INSERT INTO Session_Reports 
       (session_id, attendance, topics, homework, student_performance, notes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sessionId, attendance, topics, homework, student_performance, notes]
    );

    // Cập nhật trạng thái buổi học
    await db.query(
      "UPDATE Schedule_Sessions SET status = ? WHERE id = ?",
      [status, sessionId]
    );

    // Chuyển hướng về trang chi tiết lịch học
    res.redirect(`/schedules/${sessions[0].schedule_id}`);
  } catch (error) {
    console.error("Error in scheduleController.submitSessionReport:", error);
    res.status(500).render("error", {
      message: "Đã xảy ra lỗi khi gửi báo cáo",
      error,
    });
  }
};

// Cập nhật báo cáo buổi học
exports.updateSessionReport = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const {
      attendance,
      topics,
      homework,
      student_performance,
      notes,
      status,
    } = req.body;
    const userId = req.session.user.id;

    // Kiểm tra quyền truy cập
    const db = await dbPromise;
    const [sessions] = await db.query(
      `SELECT ss.*, s.id as schedule_id, s.tutor_id, t.user_id as tutor_user_id 
       FROM Schedule_Sessions ss
       JOIN Schedules s ON ss.schedule_id = s.id
       JOIN Tutors t ON s.tutor_id = t.id
       WHERE ss.id = ?`,
      [sessionId]
    );

    if (sessions.length === 0) {
      return res.status(404).render("error", {
        message: "Không tìm thấy buổi học",
        error: { status: 404 },
      });
    }

    // Kiểm tra quyền truy cập (phải là gia sư được gán)
    if (sessions[0].tutor_user_id !== userId) {
      return res.status(403).render("error", {
        message: "Bạn không có quyền cập nhật báo cáo buổi học này",
        error: { status: 403 },
      });
    }

    // Kiểm tra xem đã có báo cáo cho buổi học này chưa
    const [reports] = await db.query(
      "SELECT * FROM Session_Reports WHERE session_id = ?",
      [sessionId]
    );

    if (reports.length === 0) {
      return res.status(400).render("error", {
        message: "Buổi học này chưa có báo cáo. Vui lòng sử dụng chức năng tạo báo cáo.",
        error: { status: 400 },
      });
    }

    // Cập nhật báo cáo
    await db.query(
      `UPDATE Session_Reports 
       SET attendance = ?, topics = ?, homework = ?, student_performance = ?, notes = ? 
       WHERE session_id = ?`,
      [attendance, topics, homework, student_performance, notes, sessionId]
    );

    // Cập nhật trạng thái buổi học
    await db.query(
      "UPDATE Schedule_Sessions SET status = ? WHERE id = ?",
      [status, sessionId]
    );

    // Chuyển hướng về trang chi tiết lịch học
    res.redirect(`/schedules/${sessions[0].schedule_id}`);
  } catch (error) {
    console.error("Error in scheduleController.updateSessionReport:", error);
    res.status(500).render("error", {
      message: "Đã xảy ra lỗi khi cập nhật báo cáo",
      error,
    });
  }
};

// Đổi lịch buổi học
exports.rescheduleSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { newDate, newStartTime, newEndTime, reason } = req.body;
    const userId = req.session.user.id;

    // Kiểm tra quyền truy cập
    const db = await dbPromise;
    const [sessions] = await db.query(
      `SELECT ss.*, s.id as schedule_id, s.class_id, c.user_id as class_owner_id 
       FROM Schedule_Sessions ss
       JOIN Schedules s ON ss.schedule_id = s.id
       JOIN Classes c ON s.class_id = c.id
       WHERE ss.id = ?`,
      [sessionId]
    );

    if (sessions.length === 0) {
      return res.status(404).render("error", {
        message: "Không tìm thấy buổi học",
        error: { status: 404 },
      });
    }

    // Kiểm tra quyền truy cập (phải là chủ lớp)
    if (sessions[0].class_owner_id !== userId) {
      return res.status(403).render("error", {
        message: "Bạn không có quyền đổi lịch buổi học này",
        error: { status: 403 },
      });
    }

    // Kiểm tra xem buổi học có thể đổi lịch không (chỉ có thể đổi lịch buổi học sắp diễn ra)
    if (sessions[0].status !== 'upcoming') {
      return res.status(400).render("error", {
        message: "Chỉ có thể đổi lịch cho các buổi học sắp diễn ra",
        error: { status: 400 },
      });
    }

    // Lưu lịch sử đổi lịch
    await db.query(
      `INSERT INTO Session_Changes 
       (session_id, original_date, original_start_time, original_end_time, reason, change_type, user_id) 
       VALUES (?, ?, ?, ?, ?, 'reschedule', ?)`,
      [
        sessionId,
        sessions[0].date,
        sessions[0].start_time,
        sessions[0].end_time,
        reason,
        userId,
      ]
    );

    // Cập nhật lịch mới
    await db.query(
      `UPDATE Schedule_Sessions 
       SET date = ?, start_time = ?, end_time = ? 
       WHERE id = ?`,
      [newDate, newStartTime, newEndTime, sessionId]
    );

    // Chuyển hướng về trang chi tiết lịch học
    res.redirect(`/schedules/${sessions[0].schedule_id}`);
  } catch (error) {
    console.error("Error in scheduleController.rescheduleSession:", error);
    res.status(500).render("error", {
      message: "Đã xảy ra lỗi khi đổi lịch buổi học",
      error,
    });
  }
};

// Hủy buổi học
exports.cancelSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { reason } = req.body;
    const userId = req.session.user.id;

    // Kiểm tra quyền truy cập
    const db = await dbPromise;
    const [sessions] = await db.query(
      `SELECT ss.*, s.id as schedule_id, s.class_id, c.user_id as class_owner_id 
       FROM Schedule_Sessions ss
       JOIN Schedules s ON ss.schedule_id = s.id
       JOIN Classes c ON s.class_id = c.id
       WHERE ss.id = ?`,
      [sessionId]
    );

    if (sessions.length === 0) {
      return res.status(404).render("error", {
        message: "Không tìm thấy buổi học",
        error: { status: 404 },
      });
    }

    // Kiểm tra quyền truy cập (phải là chủ lớp)
    if (sessions[0].class_owner_id !== userId) {
      return res.status(403).render("error", {
        message: "Bạn không có quyền hủy buổi học này",
        error: { status: 403 },
      });
    }

    // Kiểm tra xem buổi học có thể hủy không (chỉ có thể hủy buổi học sắp diễn ra)
    if (sessions[0].status !== 'upcoming') {
      return res.status(400).render("error", {
        message: "Chỉ có thể hủy các buổi học sắp diễn ra",
        error: { status: 400 },
      });
    }

    // Lưu lịch sử hủy buổi học
    await db.query(
      `INSERT INTO Session_Changes 
       (session_id, original_date, original_start_time, original_end_time, reason, change_type, user_id) 
       VALUES (?, ?, ?, ?, ?, 'cancel', ?)`,
      [
        sessionId,
        sessions[0].date,
        sessions[0].start_time,
        sessions[0].end_time,
        reason,
        userId,
      ]
    );

    // Cập nhật trạng thái buổi học
    await db.query(
      "UPDATE Schedule_Sessions SET status = 'cancelled' WHERE id = ?",
      [sessionId]
    );

    // Chuyển hướng về trang chi tiết lịch học
    res.redirect(`/schedules/${sessions[0].schedule_id}`);
  } catch (error) {
    console.error("Error in scheduleController.cancelSession:", error);
    res.status(500).render("error", {
      message: "Đã xảy ra lỗi khi hủy buổi học",
      error,
    });
  }
};

// Tạo thêm buổi học
exports.generateMoreSessions = async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const { numberOfSessions } = req.body;
    const userId = req.session.user.id;

    // Kiểm tra quyền truy cập
    const db = await dbPromise;
    const [schedules] = await db.query(
      `SELECT s.*, c.user_id as class_owner_id 
       FROM Schedules s
       JOIN Classes c ON s.class_id = c.id
       WHERE s.id = ?`,
      [scheduleId]
    );

    if (schedules.length === 0) {
      return res.status(404).render("error", {
        message: "Không tìm thấy lịch học",
        error: { status: 404 },
      });
    }

    // Kiểm tra quyền truy cập (phải là chủ lớp)
    if (schedules[0].class_owner_id !== userId) {
      return res.status(403).render("error", {
        message: "Bạn không có quyền tạo thêm buổi học",
        error: { status: 403 },
      });
    }

    // Kiểm tra xem lịch học có đang hoạt động không
    if (schedules[0].status !== 'active') {
      return res.status(400).render("error", {
        message: "Chỉ có thể tạo thêm buổi học cho lịch học đang hoạt động",
        error: { status: 400 },
      });
    }

    // Lấy thông tin chi tiết lịch học
    const [details] = await db.query(
      "SELECT * FROM Schedule_Details WHERE schedule_id = ?",
      [scheduleId]
    );

    if (details.length === 0) {
      return res.status(400).render("error", {
        message: "Lịch học không có thông tin chi tiết",
        error: { status: 400 },
      });
    }

    // Lấy buổi học cuối cùng của lịch học
    const [lastSession] = await db.query(
      `SELECT * FROM Schedule_Sessions 
       WHERE schedule_id = ? 
       ORDER BY date DESC, start_time DESC 
       LIMIT 1`,
      [scheduleId]
    );

    let lastDate = new Date();
    if (lastSession.length > 0) {
      lastDate = new Date(lastSession[0].date);
    } else {
      lastDate = new Date(schedules[0].start_date);
    }

    // Tạo thêm buổi học
    await Schedule.generateSessions(scheduleId, details, lastDate, parseInt(numberOfSessions));

    // Chuyển hướng về trang chi tiết lịch học
    res.redirect(`/schedules/${scheduleId}`);
  } catch (error) {
    console.error("Error in scheduleController.generateMoreSessions:", error);
    res.status(500).render("error", {
      message: "Đã xảy ra lỗi khi tạo thêm buổi học",
      error,
    });
  }
};

module.exports = exports;
