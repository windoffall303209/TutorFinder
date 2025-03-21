const bcrypt = require("bcrypt");
const dbPromise = require("../config/db");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const db = await dbPromise; // Lấy kết nối từ Promise
    const [results] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (results.length === 0) {
      console.log("Rendering auth/login with error: User not found"); // Debug
      return res.render("auth/login", {
        title: "Đăng nhập",
        user: req.session.user,
        error: "Tên đăng nhập hoặc mật khẩu sai",
      });
    }

    const user = results[0];

    // Kiểm tra trạng thái is_active
    if (!user.is_active) {
      console.log("Rendering auth/login with error: Account disabled"); // Debug
      return res.render("auth/login", {
        title: "Đăng nhập",
        user: req.session.user,
        error: "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ admin.",
      });
    }

    // Kiểm tra mật khẩu
    if (await bcrypt.compare(password, user.password)) {
      req.session.user = user; // Lưu toàn bộ thông tin user vào session
      console.log("Login successful, redirecting..."); // Debug
      if (user.role === "admin") return res.redirect("/admin");
      return res.redirect("/tutors");
    } else {
      console.log("Rendering auth/login with error: Invalid password"); // Debug
      res.render("auth/login", {
        title: "Đăng nhập",
        user: req.session.user,
        error: "Tên đăng nhập hoặc mật khẩu sai",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const db = await dbPromise; // Lấy kết nối từ Promise
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, password, is_active) VALUES (?, ?, 1)",
      [username, hash]
    );
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
};