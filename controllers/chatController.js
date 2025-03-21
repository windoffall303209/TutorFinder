const dbPromise = require('../config/db');

exports.index = async (req, res) => {
    try {
        const db = await dbPromise;
        const userId = req.session.user.id;

        const [chatUsers] = await db.query(`
            SELECT DISTINCT u.id, u.display_name
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
        const db = await dbPromise;
        const userId = req.session.user.id;
        const receiverId = req.params.id;

        const [messages] = await db.query(`
            SELECT * FROM chats 
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) 
            ORDER BY created_at
        `, [userId, receiverId, receiverId, userId]);

        const [receiver] = await db.query('SELECT id, display_name FROM users WHERE id = ?', [receiverId]);
        if (!receiver.length) return res.status(404).send('User not found');

        res.render('chat/detail', { 
            title: `Chat với ${receiver[0].display_name}`, 
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