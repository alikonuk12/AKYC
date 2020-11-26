const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const path = require('path');

router.post('/newpost', (req, res) => {
    if(req.files){
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

module.exports = router;