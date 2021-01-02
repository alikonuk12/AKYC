const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const path = require('path');
const User = require('../models/User');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');

//CREATE POST
router.post('/newpost', (req, res) => {
    if (req.files) {
        let post_image = req.files.post_image;
        post_image.mv(path.resolve(__dirname, '../public/images/post_image', post_image.name));
        Post.create({
            ...req.body,
            post_image: `/images/post_image/${post_image.name}`,
            user: req.session.userId
        });
    } else {
        Post.create({
            ...req.body,
            user: req.session.userId
        });
    }
    res.redirect('/');
});

//DELETE POST
router.post('/:id', (req, res) => {
    if (req.session.userId) {
        Post.findOne({ _id: req.params.id }).then(post => {
            post.isDeleted = true;
            post.save().then(() => {
                res.redirect(req.get('referer'));
            });
            Comment.find({ post: req.params.id }).then(comment => {
                for (let i = 0; i < comment.length; i++) {
                    Comment.deleteOne({ _id: comment[i]._id }, () => { });
                }
            });
        });
    } else {
        res.render('site/sign-in');
    }
});

//LIKE POST
router.post('/:id/act', (req, res, next) => {
    const action = req.body.action;
    const counter = action === 'Like' ? 1 : -1;
    Post.updateOne({ _id: req.params.id }, { $inc: { like_number: counter } }, {}, (err, numberAffected) => {
        if (action == 'Like') {
            Like.create({ user: req.session.userId, post: req.params.id });
        } else if (action == 'Unlike') {
            Like.find({ user: req.session.userId, post: req.params.id }).then(like => {
                Like.findByIdAndRemove({ _id: like[0]._id }, () => { });
            });
        }
        res.send('');
    });
});

module.exports = router;