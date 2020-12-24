const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const VerRequest = require('../models/VerRequest');

router.get('/sign-in', function (req, res) {
    res.render('site/sign-in-admin');
});

router.get('/', function (req, res) {
    Admin.findById(req.session.userId).then(admin => {
        Post.find({ isDeleted: false }).populate({ path: 'user', model: User }).populate({ path: 'comment', model: Comment }).sort({ $natural: -1 }).then(posts => {
            Comment.find({}).sort({ $natural: -1 }).populate({ path: 'user', model: User }).then(comments => {
                VerRequest.find({ isProcessed: false }).sort({ $natural: -1 }).populate({ path: 'user', model: User }).then(verreqs => {
                    res.render('site/admin', { admin: admin, posts: posts, comments: comments, verreqs: verreqs });
                });
            });
        });
    });
});

router.post('/sign-in', function (req, res) {
    const { username, password } = req.body;
    Admin.findOne({ username }, (error, admin) => {
        if (admin) {
            if (admin.password == password) {
                req.session.userId = admin._id;
                console.log(req.session.userId);
                res.redirect('/admin');
            } else {

                req.session.sessionFlash = {
                    type: 'alert alert-warning',
                    message: 'Kullanıcı adı/Şifrenizi doğru girdiğinizden emin olun!'
                }

                res.render('site/sign-in-admin');
            }
        } else {
            req.session.sessionFlash = {
                type: 'alert alert-warning',
                message: 'Kullanıcı adı/Şifrenizi doğru girdiğinizden emin olun!'
            }

            res.render('site/sign-in-admin');
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.render('site/sign-in-admin');
    });
});

router.post('/accept/:id', (req, res) => {
    VerRequest.findById(req.params.id).then(verreq => {
        User.findById(verreq.user._id).then(user => {
            user.isVerified = true;
            user.save();
        });
        VerRequest.findById(verreq._id).then(verification => {
            verification.isProcessed = true;
            verification.save();
        });
        res.redirect('/admin');
    });
});

router.post('/decline/:id', (req, res) => {
        VerRequest.findById(req.params.id).then(verification => {
            verification.isProcessed = true;
            verification.save();
        });
        res.redirect('/admin');
});

module.exports = router;