const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    console.log(req.session);
    res.render('site/index');
});

router.get('/profiles', function (req, res) {
    res.render('site/profiles');
});

router.get('/user-profile', function (req, res) {
    res.render('site/user-profile');
});

router.get('/messages', function (req, res) {
    res.render('site/messages');
});

router.get('/profile-account-setting', function (req, res) {
    res.render('site/profile-account-setting');
});

router.get('/my-profile', function (req, res) {
    res.render('site/my-profile');
});

module.exports = router;