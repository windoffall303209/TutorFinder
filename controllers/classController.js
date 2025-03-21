const dbPromise = require("../config/db");

exports.getClasses = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 9;
  const offset = (page - 1) * limit;

  try {
    const db = await dbPromise; // Lấy kết nối từ Promise
    const [countResult] = await db.query("SELECT COUNT(*) as total FROM classes WHERE 1 = 1");
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
    const [results] = await db.query("SELECT * FROM classes WHERE id = ?", [id]);
    if (results.length === 0) return res.status(404).send("Lớp học không tồn tại");

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

  const classData = {
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

  try {
    const db = await dbPromise; // Lấy kết nối từ Promise
    await db.query("INSERT INTO classes SET ?", classData);
    res.redirect("/classes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};