const db = require("../config/db");

exports.getAdminDashboard = (req, res) => {
  res.render("admin/dashboard", {
    title: "Admin Dashboard",
    user: req.session.user,
  });
};

// Người dùng
exports.getUsers = (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;
    res.render("admin/users", {
      title: "Quản lý người dùng",
      users: results,
      user: req.session.user,
    });
  });
};

exports.getEditUser = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0)
      return res.status(404).send("Người dùng không tồn tại");
    res.render("admin/edit_user", {
      title: "Sửa người dùng",
      editUser: results[0],
      user: req.session.user,
    });
  });
};

exports.postEditUser = (req, res) => {
  const id = req.params.id;
  const { username, role } = req.body;
  db.query(
    "UPDATE users SET username = ?, role = ? WHERE id = ?",
    [username, role, id],
    (err) => {
      if (err) throw err;
      res.redirect("/admin/users");
    }
  );
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/admin/users");
  });
};

exports.disableUser = (req, res) => {
  const id = req.params.id;
  db.query("UPDATE users SET is_active = 0 WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/admin/users");
  });
};

exports.enableUser = (req, res) => {
  const id = req.params.id;
  db.query("UPDATE users SET is_active = 1 WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/admin/users");
  });
};

// Lớp học
exports.getClasses = (req, res) => {
  db.query("SELECT * FROM classes", (err, results) => {
    if (err) throw err;
    res.render("admin/classes", {
      title: "Quản lý lớp học",
      classes: results,
      user: req.session.user,
    });
  });
};

exports.getEditClass = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM classes WHERE id = ?", [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0)
      return res.status(404).send("Lớp học không tồn tại");
    res.render("admin/edit_classes", {
      title: "Sửa lớp học",
      editClass: results[0],
      user: req.session.user,
    });
  });
};

exports.postEditClass = (req, res) => {
  const id = req.params.id;
  const { parent_name, phone, subject, grade, fee_per_session } = req.body;
  db.query(
    "UPDATE classes SET parent_name = ?, phone = ?, subject = ?, grade = ?, fee_per_session = ? WHERE id = ?",
    [parent_name, phone, subject, grade, fee_per_session, id],
    (err) => {
      if (err) throw err;
      res.redirect("/admin/classes");
    }
  );
};

exports.deleteClass = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM classes WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/admin/classes");
  });
};

exports.disableClass = (req, res) => {
  const id = req.params.id;
  db.query("UPDATE classes SET is_active = 0 WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/admin/classes");
  });
};

exports.enableClass = (req, res) => {
  const id = req.params.id;
  db.query("UPDATE classes SET is_active = 1 WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/admin/classes");
  });
};

// Gia sư
exports.getTutors = (req, res) => {
  db.query("SELECT * FROM tutors", (err, results) => {
    if (err) throw err;
    res.render("admin/tutors", {
      title: "Quản lý gia sư",
      tutors: results,
      user: req.session.user,
    });
  });
};

exports.getEditTutor = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM tutors WHERE id = ?", [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0)
      return res.status(404).send("Gia sư không tồn tại");
    res.render("admin/edit_tutors", {
      title: "Sửa gia sư",
      editTutor: results[0],
      user: req.session.user,
    });
  });
};

exports.postEditTutor = (req, res) => {
  const id = req.params.id;
  const { full_name, birth_year, gender, subjects_teach } = req.body;
  db.query(
    "UPDATE tutors SET full_name = ?, birth_year = ?, gender = ?, subjects_teach = ? WHERE id = ?",
    [full_name, birth_year, gender, subjects_teach, id],
    (err) => {
      if (err) throw err;
      res.redirect("/admin/tutors");
    }
  );
};

exports.deleteTutor = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM tutors WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/admin/tutors");
  });
};

exports.disableTutor = (req, res) => {
  const id = req.params.id;
  db.query("UPDATE tutors SET is_active = 0 WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/admin/tutors");
  });
};

exports.enableTutor = (req, res) => {
  const id = req.params.id;
  db.query("UPDATE tutors SET is_active = 1 WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/admin/tutors");
  });
};

module.exports = exports;
