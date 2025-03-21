const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Đảm bảo người dùng đã đăng nhập
const ensureAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
};

router.get('/', ensureAuthenticated, chatController.index);
router.get('/detail/:id', ensureAuthenticated, chatController.detail);

module.exports = router;