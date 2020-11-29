const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const path = require('path');
const User = require('../models/User');

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

// DELETE POST
router.post('/:id', (req, res) => {
    if (req.session.userId) {
        Post.findOne({_id: req.params.id}).then(post =>{
            post.isDeleted = true;
            post.save().then(() => {
                res.redirect(req.get('referer'));            
            });
        });
    } else {
        res.render('site/sign-in');
    }
});

module.exports = router;