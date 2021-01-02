const express = require('express');
const Like = require('../models/Like');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Following = require('../models/Following');
const router = express.Router();

router.get('/', function (req, res) {
    if (req.session.userId) {
        Post.find({ isDeleted: false }).populate({ path: 'user', model: User }).populate({ path: 'likes', model: Like }).populate({ path: 'comment', model: Comment }).sort({ $natural: -1 }).then(posts => {
            User.findById({ _id: req.session.userId }).then(user => {
                Like.find({}).populate({ path: 'user', model: User }).then(like => {
                    User.find({ _id: { $ne: req.session.userId } }).sort({ _id: -1 }).limit(5).then(users => {
                        User.aggregate([
                            {
                                $lookup: {
                                    from: 'followings',
                                    localField: '_id',
                                    foreignField: 'userId',
                                    as: 'followings'
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    num_of_following: { $size: '$followings' }
                                }
                            }
                        ]).then((num_of_following) => {
                            User.aggregate([
                                {
                                    $lookup: {
                                        from: 'followers',
                                        localField: '_id',
                                        foreignField: 'userId',
                                        as: 'followers'
                                    }
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        num_of_follower: { $size: '$followers' }
                                    }
                                }
                            ]).then(num_of_follower => {
                                const following_result = num_of_following.filter(followingnum => {
                                    if (followingnum._id == req.session.userId) {
                                        return followingnum;
                                    }
                                });
                                const follower_result = num_of_follower.filter(followernum => {
                                    if (followernum._id == req.session.userId) {
                                        return followernum;
                                    }
                                });
                                const following_num = following_result[0].num_of_following;
                                const follower_num = follower_result[0].num_of_follower;

                                if(following_num > 0){
                                    Following.find({ userId: req.session.userId }).then(following => {
                                        const following_posts = [];
                                        for(let i = 0; i < posts.length; i++){
                                            for(let j = 0; j < following.length; j++){
                                                if(posts[i].user.id == following[j].following || posts[i].user.id == req.session.userId ){
                                                    following_posts.push(posts[i]);
                                                }
                                            }   
                                        }
                                        res.render('site/index', { posts: following_posts, user: user, like: like, users: users, following_num: following_num, follower_num: follower_num });
                                    });
                                }
                                else{
                                    Post.find({user: req.session.userId, isDeleted: false}).populate({ path: 'user', model: User }).populate({ path: 'likes', model: Like }).populate({ path: 'comment', model: Comment }).sort({ $natural: -1 }).then( following_posts => {
                                        res.render('site/index', { posts: following_posts, user: user, like: like, users: users, following_num: following_num, follower_num: follower_num });
                                    } );
                                }
                                
                            });
                        });
                    });
                });
            });
        });
    } else {
        res.render('site/sign-in');
    }
});

router.get('/profiles', function (req, res) {
    if (req.session.userId) {
        res.render('site/profiles');
    } else {
        res.render('site/sign-in');
    }
});

router.get('/user-profile', function (req, res) {
    if (req.session.userId) {
        res.render('site/user-profile');
    } else {
        res.render('site/sign-in');
    }
});

router.get('/messages', function (req, res) {
    if (req.session.userId) {
        res.render('site/messages');
    } else {
        res.render('site/sign-in');
    }
});

router.get('/profile-account-setting', function (req, res) {
    if (req.session.userId) {
        User.findById({ _id: req.session.userId }).then(user => {
            res.render('site/profile-account-setting', { user: user });
        });
    } else {
        res.render('site/sign-in');
    }
});



module.exports = router;