const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const path = require('path');
const VerRequest = require('../models/VerRequest');


router.get('/sign-in', (req, res) => {
    if (!req.session.userId) {
        res.render('site/sign-in');
    } else {
        res.render('site/index');
    }
});

router.post('/sign-in', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username }, (error, user) => {
        if (user) {
            if (user.password == password) {
                req.session.userId = user._id;
                res.redirect('/');
            } else {
                res.redirect('sign-in');
            }
        } else {
            res.redirect('sign-in');
        }
    });
});

router.get('/sign-up', (req, res) => {
    if (!req.session.userId) {
        res.render('site/sign-up');
    } else {
        res.render('site/index');
    }
});

router.post('/sign-up', (req, res) => {
    User.create(req.body, (error, user) => {
        res.redirect('sign-in');
    });
    req.session.sessionFlash = {
        type: 'alert alert-success',
        message: 'Başarılı bir şekilde kayıt oldunuz'
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('sign-in');
    });
});

router.get('/:id', (req, res) => {
    User.findById(req.session.userId).then(user => {
        Post.find({ user: user._id, isDeleted: false }).populate({ path: 'user', model: User }).populate({ path: 'comment', model: Comment }).sort({ $natural: -1 }).then(posts => {
            Comment.find({ user: req.session.userId }).sort({ $natural: -1 }).then(comments => {
                res.render('site/my-profile', { user: user, posts: posts, comments: comments });
            });
        });
    });
});

router.post('/updateprofile', (req, res) => {
    const { name, surname, city, job } = req.body;
    User.findById(req.session.userId).then(user => {
        user.name = name;
        user.surname = surname;
        user.city = city;
        user.job = job;
        user.save();
        res.redirect("/");
    });
});

router.post('/verificationrequest', (req, res) => {
    const idcard = req.files.idcard_image;
    idcard.mv(path.resolve(__dirname, '../public/images/idcard', idcard.name));
    VerRequest.create({
        user: req.session.userId,
        idcard_image: `/images/idcard/${idcard.name}`
    });
    res.redirect("/");
});

router.get('/profile/:id', (req, res) => {
    User.findById(req.params.id).then(user => {
        Post.find({ user: user._id, isDeleted: false }).populate({ path: 'user', model: User }).populate({ path: 'comment', model: Comment }).sort({ $natural: -1 }).then(posts => {
            Comment.find({ user: req.session.userId }).sort({ $natural: -1 }).then(comments => {
                res.render('site/user-profile', { user: user, posts: posts, comments: comments });
            });
        });
    });
});

module.exports = router;