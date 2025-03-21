require("dotenv").config();
const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const authRoutes = require("./routes/auth");
const tutorRoutes = require("./routes/tutor");
const classRoutes = require("./routes/class");
const adminRoutes = require("./routes/admin");
const chatRoutes = require("./routes/chat");
const http = require('http'); // Thêm http
const { Server } = require('socket.io'); // Thêm Socket.IO

const app = express();
const server = http.createServer(app); // Tạo server HTTP
const io = new Server(server); // Khởi tạo Socket.IO

// Cấu hình multer để upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
console.log("Views path:", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");
console.log(
  "Layout set to:",
  path.join(__dirname, "views", "layouts", "main.ejs")
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/auth", authRoutes);
app.use("/tutors", tutorRoutes);
app.use("/classes", classRoutes);
app.use("/admin", adminRoutes);
app.use("/chat", chatRoutes);

// Trang chủ và liên hệ
app.get("/", (req, res) => {
  console.log("Rendering intro/index");
  res.render("intro/index", { title: "Giới thiệu", user: req.session.user });
});
app.get("/contact", (req, res) => {
  console.log("Rendering contact/index");
  res.render("contact/index", { title: "Liên hệ", user: req.session.user });
});

// Xử lý Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('sendMessage', async (data) => {
        const { senderId, receiverId, message } = data;
        try {
            const db = require('./config/db');
            await db.query(
                'INSERT INTO chats (sender_id, receiver_id, message) VALUES (?, ?, ?)',
                [senderId, receiverId, message]
            );
            io.to(`chat-${senderId}-${receiverId}`)
              .to(`chat-${receiverId}-${senderId}`)
              .emit('receiveMessage', {
                  senderId,
                  receiverId,
                  message,
                  created_at: new Date()
              });
        } catch (err) {
            console.error('Error saving message:', err);
        }
    });

    socket.on('joinChat', ({ senderId, receiverId }) => {
        const room = `chat-${senderId}-${receiverId}`;
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));