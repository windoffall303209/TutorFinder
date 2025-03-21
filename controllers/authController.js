const bcrypt = require("bcrypt");
const dbPromise = require("../config/db");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const db = await dbPromise;
    const [results] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (results.length === 0) {
      console.log("Rendering auth/login with error: User not found");
      return res.render("auth/login", {
        title: "Đăng nhập",
        user: req.session.user,
        error: "Tên đăng nhập hoặc mật khẩu sai",
      });
    }

    const user = results[0];

    if (!user.is_active) {
      console.log("Rendering auth/login with error: Account disabled");
      return res.render("auth/login", {
        title: "Đăng nhập",
        user: req.session.user,
        error: "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ admin.",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      req.session.user = {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        role: user.role
      };
      console.log("Login successful, redirecting...");
      if (user.role === "admin") return res.redirect("/admin");
      return res.redirect("/tutors");
    } else {
      console.log("Rendering auth/login with error: Invalid password");
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
  const { display_name, username, password, confirm_password } = req.body;

  // Kiểm tra xác nhận mật khẩu
  if (password !== confirm_password) {
    return res.render("auth/register", {
      title: "Đăng ký",
      error: "Mật khẩu và xác nhận mật khẩu không khớp",
    });
  }

  try {
    const db = await dbPromise;

    // Kiểm tra username đã tồn tại chưa
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      return res.render("auth/register", {
        title: "Đăng ký",
        error: "Tên đăng nhập đã tồn tại",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, password, display_name, is_active) VALUES (?, ?, ?, 1)",
      [username, hash, display_name]
    );
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.status(500).render("auth/register", {
      title: "Đăng ký",
      error: "Có lỗi xảy ra, vui lòng thử lại",
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
};