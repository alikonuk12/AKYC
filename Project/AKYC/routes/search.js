const express = require('express');
const router = express.Router();
const User = require('../models/User');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/", (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        User.find({ "username": regex,  _id: { $ne: req.session.userId } }).then(users => {
            User.findById(req.session.userId).then(user => {
                res.render('site/profiles', { users: users, user: user });
            });
        });
    }else{
        User.find({ _id: { $ne: req.session.userId } }).then(users => {
            User.findById(req.session.userId).then(user => {
                res.render('site/profiles', { users: users, user: user });
            });
        });
    }
});

module.exports = router;