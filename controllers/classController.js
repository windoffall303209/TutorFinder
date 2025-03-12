const db = require("../config/db");

exports.getClasses = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 9; // Giới hạn 9 lớp mỗi trang
  const offset = (page - 1) * limit;

  const { subject, grade, district, learning_mode } = req.query;

  let query = "SELECT * FROM classes WHERE 1=1";
  let queryParams = [];

  if (subject) {
    query += " AND subject = ?";
    queryParams.push(subject);
  }
  if (grade) {
    query += " AND grade = ?";
    queryParams.push(grade);
  }
  if (district) {
    query += " AND district = ?";
    queryParams.push(district);
  }
  if (learning_mode) {
    query += " AND learning_mode = ?";
    queryParams.push(learning_mode);
  }

  query += " LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  db.query(
    "SELECT COUNT(*) as total FROM classes WHERE 1=1",
    (err, countResult) => {
      if (err) throw err;
      const totalClasses = countResult[0].total;
      const totalPages = Math.ceil(totalClasses / limit);

      db.query(query, queryParams, (err, results) => {
        if (err) throw err;
        res.render("classes/list", {
          title: "Danh sách lớp trống",
          classes: results,
          currentPage: page,
          totalPages,
          user: req.session.user,
        });
      });
    }
  );
};

exports.getClassDetail = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM classes WHERE id = ?", [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0)
      return res.status(404).send("Lớp học không tồn tại");
    console.log("Rendering classes/detail"); // Debug
    res.render("classes/detail", {
      title: "Chi tiết lớp học",
      classObj: results[0],
      user: req.session.user,
    });
  });
};

exports.registerClass = (req, res) => {
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
  };
  db.query("INSERT INTO classes SET ?", classData, (err) => {
    if (err) throw err;
    res.redirect("/classes");
  });
};
