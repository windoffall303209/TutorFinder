const db = require('../config/db'); // Giả định bạn đã có file config db

exports.index = async (req, res) => {
    try {
        const userId = req.session.user.id;

        // Truy vấn danh sách người dùng đã chat với user hiện tại
        const [chatUsers] = await db.query(`
            SELECT DISTINCT u.id, u.username
            FROM users u
            INNER JOIN chats c ON (u.id = c.sender_id OR u.id = c.receiver_id)
            WHERE (c.sender_id = ? OR c.receiver_id = ?) AND u.id != ?
        `, [userId, userId, userId]);

        res.render('chat/index', { 
            title: 'Danh sách chat', 
            users: chatUsers, 
            user: req.session.user 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

exports.detail = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const receiverId = req.params.id;

        // Lấy lịch sử tin nhắn
        const [messages] = await db.query(`
            SELECT * FROM chats 
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) 
            ORDER BY created_at
        `, [userId, receiverId, receiverId, userId]);

        // Lấy thông tin người nhận
        const [receiver] = await db.query('SELECT id, username FROM users WHERE id = ?', [receiverId]);
        if (!receiver.length) return res.status(404).send('User not found');

        res.render('chat/detail', { 
            title: `Chat với ${receiver[0].username}`, 
            messages, 
            receiver: receiver[0], 
            userId,
            user: req.session.user 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};