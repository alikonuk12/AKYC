const express = require('express');
const router = express.Router();
const Following = require('../models/Following');
const Follower = require('../models/Follower');

router.post('/:id/act', (req, res, next) => {
    const followstatus = req.body.followstatus;
    if (followstatus == 'Follow') {
        Following.create({ userId: req.session.userId, following: req.params.id });
        Follower.create({ userId: req.params.id, follower: req.session.userId });
    } else if (followstatus == 'Unfollow') {
        Following.find({ userId: req.session.userId, following: req.params.id }).then(following => {
            Following.findByIdAndRemove({ _id: following[0]._id }, () => { });
        });
        Follower.find({ userId: req.params.id, follower: req.session.userId }).then(follower => {
            Follower.findByIdAndRemove({ _id: follower[0]._id }, () => { });
        });
    }
    res.send('');

});

router.get('/follows', (req, res) => {
    Following.find({ userId: req.session.userId }).then(user_following => {
        return res.status(200).json({ data: user_following });
    });
});

module.exports = router;