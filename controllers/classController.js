const dbPromise = require("../config/db");

exports.getClasses = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 9;
  const offset = (page - 1) * limit;

  try {
    const db = await dbPromise; // Lấy kết nối từ Promise
    const [countResult] = await db.query(
      "SELECT COUNT(*) as total FROM classes WHERE 1 = 1"
    );
    const totalClasses = countResult[0].total;
    const totalPages = Math.ceil(totalClasses / limit);

    const [results] = await db.query(
      "SELECT * FROM classes WHERE is_active = 1 LIMIT ? OFFSET ?",
      [limit, offset]
    );

    console.log("Rendering classes/list"); // Debug
    res.render("classes/list", {
      title: "Danh sách lớp trống",
      classes: results,
      currentPage: page,
      totalPages,
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getClassDetail = async (req, res) => {
  const id = req.params.id;
  try {
    const db = await dbPromise; // Lấy kết nối từ Promise
    const [results] = await db.query(
      `
      SELECT c.*, u.id as user_id, u.display_name as user_name 
      FROM classes c
      LEFT JOIN users u ON c.user_id = u.id 
      WHERE c.id = ?
    `,
      [id]
    );

    if (results.length === 0)
      return res.status(404).send("Lớp học không tồn tại");

    console.log("Rendering classes/detail"); // Debug
    res.render("classes/detail", {
      title: "Chi tiết lớp học",
      classObj: results[0],
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.registerClass = async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");

  try {
    const db = await dbPromise;

    // Kiểm tra xem người dùng đã tạo lớp học chưa
    const [existingClass] = await db.query(
      "SELECT * FROM classes WHERE user_id = ?",
      [req.session.user.id]
    );

    if (existingClass.length > 0) {
      // Nếu đã tạo lớp học, hiển thị form với thông báo lỗi
      return res.render("contact/index", {
        title: "Đăng ký lớp học",
        user: req.session.user,
        error: "Bạn đã đăng ký lớp học. Vui lòng quay lại trang trước.",
        formType: "class",
      });
    }

    const classData = {
      user_id: req.session.user.id,
      parent_name: req.body.parent_name,
      phone: req.body.phone,
      district: req.body.district,
      province: req.body.province,
      specific_address: req.body.specific_address,
      tutor_gender: req.body.tutor_gender,
      sessions_per_week: req.body.sessions_per_week,
      fee_per_session: req.body.fee_per_session,
      grade: req.body.grade,
      subject: req.body.subject,
      description: req.body.description,
      learning_mode: req.body.learning_mode,
      status: req.body.status,
    };

    await db.query("INSERT INTO classes SET ?", classData);
    res.redirect("/classes");
  } catch (err) {
    console.error(err);
    // Hiển thị form với thông báo lỗi
    return res.render("contact/index", {
      title: "Đăng ký lớp học",
      user: req.session.user,
      error: "Có lỗi xảy ra. Vui lòng thử lại sau.",
      formType: "class",
    });
  }
};
