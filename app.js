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
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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
            const db = await require('./config/db'); // Đảm bảo dùng dbPromise
            await db.query(
                'INSERT INTO chats (sender_id, receiver_id, message) VALUES (?, ?, ?)',
                [senderId, receiverId, message]
            );

            // Gửi tin nhắn realtime
            io.to(`chat-${senderId}-${receiverId}`)
              .to(`chat-${receiverId}-${senderId}`)
              .emit('receiveMessage', {
                  senderId,
                  receiverId,
                  message,
                  created_at: new Date()
              });

            // Cập nhật danh sách chat cho sender
            const [chatUsers] = await db.query(`
                SELECT DISTINCT u.id, u.display_name, MAX(c.created_at) as last_message_time
                FROM users u
                INNER JOIN chats c ON (u.id = c.sender_id OR u.id = c.receiver_id)
                WHERE (c.sender_id = ? OR c.receiver_id = ?) AND u.id != ?
                GROUP BY u.id, u.display_name
                ORDER BY last_message_time DESC
            `, [senderId, senderId, senderId]);
            io.to(`chat-${senderId}-${receiverId}`).emit('updateChatList', chatUsers);

            // Cập nhật danh sách chat cho receiver
            const [receiverChatUsers] = await db.query(`
                SELECT DISTINCT u.id, u.display_name, MAX(c.created_at) as last_message_time
                FROM users u
                INNER JOIN chats c ON (u.id = c.sender_id OR u.id = c.receiver_id)
                WHERE (c.sender_id = ? OR c.receiver_id = ?) AND u.id != ?
                GROUP BY u.id, u.display_name
                ORDER BY last_message_time DESC
            `, [receiverId, receiverId, receiverId]);
            io.to(`chat-${receiverId}-${senderId}`).emit('updateChatList', receiverChatUsers);

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