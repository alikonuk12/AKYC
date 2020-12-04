const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

router.post('/newcomment', (req, res) => {
    User.find({_id: req.session.userId}).then(online => {
    Comment.create({
        ...req.body,
        username: online[0].username
    }).then(comment => {
        Post.findByIdAndUpdate(req.body.post, {$push: {"comment": comment._id}}, {safe: true, upsert: true}, () => {});
    });
    res.redirect('/');
});
});

router.get('/user', (req,res) => {
    User.find({_id: req.session.userId}).then(user => {
        return res.status(200).json({ data: user });
    })
})

module.exports = router;