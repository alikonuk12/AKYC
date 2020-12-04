const express = require('express');
const router = express.Router();
const Like = require('../models/Like');

router.get('/like', (req, res) => {
    Like.find({ user: req.session.userId }).then(user_likes => {
        return res.status(200).json({ data: user_likes });
    });
});

module.exports = router;