const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

router.get('/', function (req, res) {
    if (req.session.userId) {
        Post.find({}).then(posts => {
            res.render('site/index', { posts: posts });
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
        res.render('site/profile-account-setting');
    } else {
        res.render('site/sign-in');
    }
});

router.get('/my-profile', function (req, res) {
    if (req.session.userId) {
        res.render('site/my-profile');
    } else {
        res.render('site/sign-in');
    }
});

module.exports = router;