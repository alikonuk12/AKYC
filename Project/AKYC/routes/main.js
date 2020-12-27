const express = require('express');
const Like = require('../models/Like');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const router = express.Router();

router.get('/', function (req, res) {
    if (req.session.userId) {
        Post.find({ isDeleted: false }).populate({ path: 'user', model: User }).populate({ path: 'likes', model: Like }).populate({ path: 'comment', model: Comment }).sort({ $natural: -1 }).then(posts => {
            User.findById({ _id: req.session.userId }).then(user => {
                Like.find({}).populate({ path: 'user', model: User }).then(like => {
                    User.find({  _id : { $ne: req.session.userId } }).sort({_id:-1}).limit(5).then(users => {
                     res.render('site/index', { posts: posts, user: user, like: like, users: users });
                });
            });
            });
        });
    } else {
        res.render('site/sign-in');
    }
});

router.get('/profiles', function (req, res) {
    if (req.session.userId) {
        res.render('site/profiles');
    } else {
        res.render('site/sign-in');
    }
});

router.get('/user-profile', function (req, res) {
    if (req.session.userId) {
        res.render('site/user-profile');
    } else {
        res.render('site/sign-in');
    }
});

router.get('/messages', function (req, res) {
    if (req.session.userId) {
        res.render('site/messages');
    } else {
        res.render('site/sign-in');
    }
});

router.get('/profile-account-setting', function (req, res) {
    if (req.session.userId) {
        User.findById({ _id: req.session.userId }).then(user => {
            res.render('site/profile-account-setting', { user: user });
        });
    } else {
        res.render('site/sign-in');
    }
});



module.exports = router;