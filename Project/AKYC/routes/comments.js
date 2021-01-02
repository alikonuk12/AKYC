const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

//CREATE COMMENT
router.post('/newcomment', (req, res) => {
    User.find({ _id: req.session.userId }).then(online => {
        Comment.create({
            ...req.body,
            username: online[0].username,
            user: req.session.userId
        }).then(comment => {
            Post.findByIdAndUpdate(req.body.post, { $push: { "comment": comment._id } }, { safe: true, upsert: true }, () => { });
            Post.findById(req.body.post).then(post => { post.comment_number++; post.save(); });
        });
        res.redirect(req.get('referer'));
    });
});

//DELETE COMMENT
router.post('/:id', (req, res) => {
    if (req.session.userId) {
        Comment.findById(req.params.id).then(comment => {
            Post.findById(comment.post).then(post => {
                post.comment_number--;
                post.save();
            });
        });
        Comment.deleteOne({ _id: req.params.id }, () => { });
        res.redirect(req.get('referer'));
    } else {
        res.render('site/sign-in');
    }
});

module.exports = router;