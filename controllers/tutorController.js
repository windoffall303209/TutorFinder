const dbPromise = require("../config/db");

exports.getTutors = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 9;
  const offset = (page - 1) * limit;

  const { search, gender, district, education_level, subjects_teach, classes_teach } = req.query;

  let query = "SELECT * FROM tutors WHERE is_active=1";
  let queryParams = [];

  if (search) {
    query += " AND full_name LIKE ?";
    queryParams.push(`%${search}%`);
  }
  if (gender) {
    query += " AND gender = ?";
    queryParams.push(gender);
  }
  if (district) {
    query += " AND district = ?";
    queryParams.push(district);
  }
  if (education_level) {
    query += " AND education_level = ?";
    queryParams.push(education_level);
  }
  if (subjects_teach) {
    query += " AND subjects_teach LIKE ?";
    queryParams.push(`%${subjects_teach}%`);
  }
  if (classes_teach) {
    query += " AND FIND_IN_SET(?, classes_teach)";
    queryParams.push(classes_teach);
  }

  query += " LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  try {
    const db = await dbPromise;
    const [countResult] = await db.query("SELECT COUNT(*) as total FROM tutors WHERE 1=1");
    const totalTutors = countResult[0].total;
    const totalPages = Math.ceil(totalTutors / limit);

    const [results] = await db.query(query, queryParams);

    res.render("tutors/list", {
      title: "Danh sách gia sư",
      tutors: results,
      currentPage: page,
      totalPages,
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getTutorDetail = async (req, res) => {
  const id = req.params.id;
  try {
    const db = await dbPromise;
    const [results] = await db.query("SELECT * FROM tutors WHERE id = ?", [id]);
    if (results.length === 0) return res.status(404).send("Gia sư không tồn tại");

    res.render("tutors/detail", {
      title: "Chi tiết gia sư",
      tutor: results[0],
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.registerTutor = async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");

  const classes_teach = req.body.classes_teach
    ? req.body.classes_teach.split(",")
    : [];

  const tutorData = {
    user_id: req.session.user.id,
    full_name: req.body.full_name,
    birth_year: req.body.birth_year,
    gender: req.body.gender,
    address: req.body.address,
    district: req.body.district,
    province: req.body.province,
    phone: req.body.phone,
    classes_teach: classes_teach.join(","),
    subjects_teach: req.body.subjects_teach,
    education_level: req.body.education_level,
    introduction: req.body.introduction,
    photo: req.file ? `/uploads/${req.file.filename}` : null,
  };

  try {
    const db = await dbPromise;
    await db.query("INSERT INTO tutors SET ?", tutorData);
    res.redirect("/tutors");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};