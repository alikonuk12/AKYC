const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');


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
    User.findById(req.params.id).then(user => {
        Post.find({user: user._id, isDeleted: false}).then(posts =>{
            res.render('site/my-profile', { user: user, posts: posts });
        });        
    });
});

module.exports = router;