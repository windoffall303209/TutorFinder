const dbPromise = require('../config/db');

exports.index = async (req, res) => {
    try {
        const db = await dbPromise;
        const userId = req.session.user.id;
        const receiverId = req.query.receiverId;

        const [chatUsers] = await db.query(`
            SELECT DISTINCT u.id, u.display_name, t.photo
            FROM users u
            INNER JOIN chats c ON (u.id = c.sender_id OR u.id = c.receiver_id)
            LEFT JOIN tutors t ON u.id = t.user_id
            WHERE (c.sender_id = ? OR c.receiver_id = ?) AND u.id != ?
        `, [userId, userId, userId]);

        let messages = [];
        let receiver = null;

        if (receiverId) {
            [messages] = await db.query(`
                SELECT * FROM chats 
                WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) 
                ORDER BY created_at
            `, [userId, receiverId, receiverId, userId]);

            [receiver] = await db.query(`
                SELECT u.id, u.display_name, t.photo 
                FROM users u 
                LEFT JOIN tutors t ON u.id = t.user_id 
                WHERE u.id = ?
            `, [receiverId]);

            if (!receiver.length) receiver = null;
            else receiver = receiver[0];
        }

        res.render('chat/index', { 
            title: 'Chat', 
            users: chatUsers, 
            messages,
            receiver,
            userId,
            user: req.session.user 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

// Route phụ để trả về tin nhắn dưới dạng JSON
exports.getMessages = async (req, res) => {
    try {
        const db = await dbPromise;
        const userId = req.query.senderId;
        const receiverId = req.query.receiverId;

        const [messages] = await db.query(`
            SELECT * FROM chats 
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) 
            ORDER BY created_at
        `, [userId, receiverId, receiverId, userId]);

        res.json({ messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};