const dbPromise = require("../config/db");

// Hiển thị trang chat với danh sách người dùng và tin nhắn
exports.index = async (req, res) => {
  try {
    const db = await dbPromise;
    const userId = req.session.user.id;
    const receiverId = req.query.receiverId;

    const [chatUsers] = await db.query(
      `
            SELECT DISTINCT u.id, 
                   COALESCE(u.display_name, t.full_name, c.parent_name, u.username) as display_name, 
                   t.photo
            FROM Users u
            INNER JOIN Chats ch ON (u.id = ch.sender_id OR u.id = ch.receiver_id)
            LEFT JOIN Tutors t ON u.id = t.user_id
            LEFT JOIN Classes c ON u.id = c.user_id
            WHERE (ch.sender_id = ? OR ch.receiver_id = ?) AND u.id != ?
        `,
      [userId, userId, userId]
    );

    let messages = [];
    let receiver = null;

    if (receiverId) {
      [messages] = await db.query(
        `
                SELECT * FROM Chats 
                WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) 
                ORDER BY created_at
            `,
        [userId, receiverId, receiverId, userId]
      );

      [receiver] = await db.query(
        `
                SELECT u.id, 
                       COALESCE(u.display_name, t.full_name, c.parent_name, u.username) as display_name, 
                       t.photo 
                FROM Users u 
                LEFT JOIN Tutors t ON u.id = t.user_id 
                LEFT JOIN Classes c ON u.id = c.user_id
                WHERE u.id = ?
            `,
        [receiverId]
      );

      if (!receiver.length) receiver = null;
      else {
        receiver = receiver[0];
        
        // Thêm receiver vào danh sách chatUsers nếu chưa có
        const existingUser = chatUsers.find(user => user.id == receiverId);
        if (!existingUser) {
          chatUsers.unshift(receiver); // Thêm vào đầu danh sách
        }
      }
    }

    res.render("chat/index", {
      title: "Chat",
      users: chatUsers,
      messages,
      receiver,
      userId,
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Lấy tin nhắn giữa 2 người dùng dưới dạng JSON
exports.getMessages = async (req, res) => {
  try {
    const db = await dbPromise;
    const userId = req.query.senderId;
    const receiverId = req.query.receiverId;

    const [messages] = await db.query(
      `
            SELECT * FROM Chats 
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) 
            ORDER BY created_at
        `,
      [userId, receiverId, receiverId, userId]
    );

    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Tìm kiếm người dùng theo tên để chat
exports.searchUsers = async (req, res) => {
  try {
    const db = await dbPromise;
    const userId = req.session.user.id;
    const searchQuery = req.query.query || "";

    // Tìm kiếm người dùng dựa trên tên (display_name, full_name, parent_name hoặc username)
    const [users] = await db.query(
      `
            SELECT u.id, 
                   COALESCE(u.display_name, t.full_name, c.parent_name, u.username) as display_name, 
                   t.photo
            FROM Users u
            LEFT JOIN Tutors t ON u.id = t.user_id
            LEFT JOIN Classes c ON u.id = c.user_id
            WHERE u.id != ? AND (
                u.display_name LIKE ? OR
                t.full_name LIKE ? OR 
                c.parent_name LIKE ? OR 
                u.username LIKE ?
            )
            ORDER BY COALESCE(u.display_name, t.full_name, c.parent_name, u.username)
            LIMIT 30
        `,
      [userId, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
    );

    res.json({ users });
  } catch (err) {
    console.error("Lỗi khi tìm kiếm người dùng:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
