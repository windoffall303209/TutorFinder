const dbPromise = require("../config/db");

exports.index = async (req, res) => {
  try {
    const db = await dbPromise;
    const userId = req.session.user.id;
    const receiverId = req.query.receiverId;

    // Lấy danh sách người dùng đã chat và người tạo lớp học
    const [chatUsers] = await db.query(
      `
            SELECT DISTINCT u.id, u.display_name, t.photo
            FROM users u
            LEFT JOIN (
                SELECT DISTINCT 
                    CASE 
                        WHEN sender_id = ? THEN receiver_id 
                        ELSE sender_id 
                    END as user_id
                FROM chats 
                WHERE sender_id = ? OR receiver_id = ?
            ) c ON u.id = c.user_id
            LEFT JOIN tutors t ON u.id = t.user_id
            LEFT JOIN classes cls ON u.id = cls.user_id
            WHERE (c.user_id IS NOT NULL OR cls.user_id IS NOT NULL) AND u.id != ?
        `,
      [userId, userId, userId, userId]
    );

    let messages = [];
    let receiver = null;

    if (receiverId) {
      [messages] = await db.query(
        `
                SELECT * FROM chats 
                WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) 
                ORDER BY created_at
            `,
        [userId, receiverId, receiverId, userId]
      );

      [receiver] = await db.query(
        `
                SELECT u.id, u.display_name, t.photo 
                FROM users u 
                LEFT JOIN tutors t ON u.id = t.user_id 
                WHERE u.id = ?
            `,
        [receiverId]
      );

      if (!receiver.length) receiver = null;
      else receiver = receiver[0];
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

// Route phụ để trả về tin nhắn dưới dạng JSON
exports.getMessages = async (req, res) => {
  try {
    const db = await dbPromise;
    const userId = req.query.senderId;
    const receiverId = req.query.receiverId;

    const [messages] = await db.query(
      `
            SELECT * FROM chats 
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
