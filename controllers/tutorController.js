const db = require("../config/db");

exports.getTutors = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 9; // Giới hạn 9 gia sư mỗi trang
  const offset = (page - 1) * limit;

  db.query("SELECT COUNT(*) as total FROM tutors", (err, countResult) => {
    if (err) throw err;
    const totalTutors = countResult[0].total;
    const totalPages = Math.ceil(totalTutors / limit);

    db.query(
      "SELECT * FROM tutors LIMIT ? OFFSET ?",
      [limit, offset],
      (err, results) => {
        if (err) throw err;
        console.log("Rendering tutors/list"); // Debug
        res.render("tutors/list", {
          title: "Danh sách gia sư",
          tutors: results,
          currentPage: page,
          totalPages,
          user: req.session.user,
        });
      }
    );
  });
};

exports.getTutorDetail = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM tutors WHERE id = ?", [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0)
      return res.status(404).send("Gia sư không tồn tại");
    console.log("Rendering tutors/detail");
    res.render("tutors/detail", {
      title: "Chi tiết gia sư",
      tutor: results[0],
      user: req.session.user,
    });
  });
};

exports.registerTutor = (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  const tutorData = {
    user_id: req.session.user.id,
    full_name: req.body.full_name,
    birth_year: req.body.birth_year,
    gender: req.body.gender,
    address: req.body.address,
    district: req.body.district,
    province: req.body.province,
    classes_teach: req.body.classes_teach,
    subjects_teach: req.body.subjects_teach,
    education_level: req.body.education_level,
    introduction: req.body.introduction,
    photo: req.file ? `/uploads/${req.file.filename}` : null,
  };
  db.query("INSERT INTO tutors SET ?", tutorData, (err) => {
    if (err) throw err;
    res.redirect("/tutors");
  });
};
