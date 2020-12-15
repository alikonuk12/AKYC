const express = require('express');
const router = express.Router();
const User = require('../models/User');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/", (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        User.find({ "username": regex }).then(users => {
            res.render('site/profiles', { users: users });
        });
    }
});

module.exports = router;