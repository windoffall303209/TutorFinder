const dbPromise = require("../config/db");

exports.getAdminDashboard = (req, res) => {
  res.render("admin/dashboard", {
    title: "Admin Dashboard",
    user: req.session.user,
  });
};

// Người dùng
exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const offset = (page - 1) * limit;

  try {
    const db = await dbPromise;
    const [countResult] = await db.query("SELECT COUNT(*) as total FROM users");
    const totalUsers = countResult[0].total;
    const totalPages = Math.ceil(totalUsers / limit);

    const [results] = await db.query(
      "SELECT * FROM users LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.render("admin/users", {
      title: "Quản lý người dùng",
      users: results,
      currentPage: page,
      totalPages,
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.getEditUser = async (req, res) => {
  const id = req.params.id;
  try {
    const db = await dbPromise;
    const [results] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (results.length === 0) return res.status(404).send("Người dùng không tồn tại");

    res.render("admin/edit_user", {
      title: "Sửa người dùng",
      editUser: results[0],
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.postEditUser = async (req, res) => {
  const id = req.params.id;
  const { username, role } = req.body;
  try {
    const db = await dbPromise;
    await db.query(
      "UPDATE users SET username = ?, role = ? WHERE id = ?",
      [username, role, id]
    );
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const db = await dbPromise;
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.disableUser = async (req, res) => {
  const id = req.params.id;
  try {
    const db = await dbPromise;
    await db.query("UPDATE users SET is_active = 0 WHERE id = ?", [id]);
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.enableUser = async (req, res) => {
  const id = req.params.id;
  try {
    const db = await dbPromise;
    await db.query("UPDATE users SET is_active = 1 WHERE id = ?", [id]);
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Lớp học
exports.getClasses = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const offset = (page - 1) * limit;

  try {
    const db = await dbPromise;
    const [countResult] = await db.query("SELECT COUNT(*) as total FROM classes");
    const totalClasses = countResult[0].total;
    const totalPages = Math.ceil(totalClasses / limit);

    const [results] = await db.query(
      "SELECT * FROM classes LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.render("admin/classes", {
      title: "Quản lý lớp học",
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

exports.getEditClass = async (req, res) => {
  const id = req.params.id;
  try {
    const db = await dbPromise;
    const [results] = await db.query("SELECT * FROM classes WHERE id = ?", [id]);
    if (results.length === 0) return res.status(404).send("Lớp học không tồn tại");

    res.render("admin/edit_classes", {
      title: "Sửa lớp học",
      editClass: results[0],
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.postEditClass = async (req, res) => {
  const id = req.params.id;
  const { parent_name, phone, subject, grade, fee_per_session, learning_mode, status } = req.body;
  try {
    const db = await dbPromise;
    await db.query(
      "UPDATE classes SET parent_name = ?, phone = ?, subject = ?, grade = ?, fee_per_session = ?, learning_mode = ?, status = ? WHERE id = ?",
      [parent_name, phone, subject, grade, fee_per_session, learning_mode, status, id]
    );
    res.redirect("/admin/classes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteClass = async (req, res) => {
  const id = req.params.id;
  try {
    const db = await dbPromise;
    await db.query("DELETE FROM classes WHERE id = ?", [id]);
    res.redirect("/admin/classes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.disableClass = async (req, res) => {
  const id = req.params.id;
  try {
    const db = await dbPromise;
    await db.query("UPDATE classes SET is_active = 0 WHERE id = ?", [id]);
    res.redirect("/admin/classes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.enableClass = async (req, res) => {
  const id = req.params.id;
  try {
    const db = await dbPromise;
    await db.query("UPDATE classes SET is_active = 1 WHERE id = ?", [id]);
    res.redirect("/admin/classes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Gia sư
exports.getTutors = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 15;
  const offset = (page - 1) * limit;

  try {
    const db = await dbPromise;
    const [countResult] = await db.query("SELECT COUNT(*) as total FROM tutors");
    const totalTutors = countResult[0].total;
    const totalPages = Math.ceil(totalTutors / limit);

    const [results] = await db.query(
      "SELECT * FROM tutors LIMIT ? OFFSET ?",
      [limit, offset]
    );

    res.render("admin/tutors", {
      title: "Quản lý gia sư",
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

exports.getEditTutor = async (req, res) => {
  const id = req.params.id;
  try {
    const db = await dbPromise;
    const [results] = await db.query("SELECT * FROM tutors WHERE id = ?", [id]);
    if (results.length === 0) return res.status(404).send("Gia sư không tồn tại");

    res.render("admin/edit_tutors", {
      title: "Sửa gia sư",
      editTutor: results[0],
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.postEditTutor = async (req, res) => {
  const id = req.params.id;
  const { full_name, birth_year, gender, subjects_teach } = req.body;
  try {
    const db = await dbPromise;
    await db.query(
      "UPDATE tutors SET full_name = ?, birth_year = ?, gender = ?, subjects_teach = ? WHERE id = ?",
      [full_name, birth_year, gender, subjects_teach, id]
    );
    res.redirect("/admin/tutors");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteTutor = async (req, res) => {
  const id = req.params.id;
  try {
    const db = await dbPromise;
    await db.query("DELETE FROM tutors WHERE id = ?", [id]);
    res.redirect("/admin/tutors");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.disableTutor = async (req, res) => {
  const id = req.params.id;
  try {
    const db = await dbPromise;
    await db.query("UPDATE tutors SET is_active = 0 WHERE id = ?", [id]);
    res.redirect("/admin/tutors");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.enableTutor = async (req, res) => {
  const id = req.params.id;
  try {
    const db = await dbPromise;
    await db.query("UPDATE tutors SET is_active = 1 WHERE id = ?", [id]);
    res.redirect("/admin/tutors");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = exports;