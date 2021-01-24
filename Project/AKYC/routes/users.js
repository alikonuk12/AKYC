const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const path = require('path');
const VerRequest = require('../models/VerRequest');
const Following = require('../models/Following');
const Follower = require('../models/Follower');
 //const Admin = require('../models/Admin');

const bcrypt = require('bcrypt');
const saltRounds = 12;
const txtprefix = "prefix";

function hashStrSync(txtSaf) {
    return bcrypt.hashSync(`${txtprefix}${txtSaf}`, saltRounds);
}

function compareStrSync(txtSaf, txtHashli) {
    return bcrypt.compareSync(`${txtprefix}${txtSaf}`, txtHashli);
}


router.get('/sign-in', (req, res) => {
    /*  const admin_password = hashStrSync("akyc2020");
     Admin.create({ password: admin_password }, () => {}); */
    if (!req.session.userId) {
        res.redirect('/');
    } else {
        res.render('site/index');
    }
});

router.post('/sign-in', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username }, (error, user) => {
        if (user) {
            if (compareStrSync(password, user.password)) {
                req.session.userId = user._id;
                res.redirect('/');
            } else {

                req.session.sessionFlash = {
                    type: 'alert alert-warning',
                    message: 'Kullanıcı adı/Şifrenizi doğru girdiğinizden emin olun!'
                }

                res.redirect('/');
            }
        } else {
            req.session.sessionFlash = {
                type: 'alert alert-warning',
                message: 'Kullanıcı adı/Şifrenizi doğru girdiğinizden emin olun!'
            }

            res.redirect('/');
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
    const pass = req.body.password;
    if(pass.length < 7){
        req.session.sessionFlash = {
            type: 'alert alert-warning',
            message: 'Şifreniz en az 7 haneli olmalıdır!'
        }
        res.redirect(req.get('referer'));
        return false;
    } 

    const username = req.body.username;
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const birthdate = req.body.birthdate;
    const city = req.body.city;
    const job = req.body.job;
    const password = hashStrSync(req.body.password);

    User.create({ username: username, name: name, surname: surname, email: email, birthdate: birthdate, city: city, job: job, password: password }).then(user => {

        req.session.sessionFlash = {
            type: 'alert alert-success',
            message: 'Başarılı bir şekilde kayıt oldunuz'
        }

        res.redirect('/');
    }).catch(() => {
        req.session.sessionFlash = {
            type: 'alert alert-warning',
            message: 'Kayıt esnasında hata oluştu. Tekrar deneyiniz.'
        }
        res.redirect('/');
    });

});

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('sign-in');
    });
});

router.get('/:id', (req, res) => {
    User.findById(req.session.userId).then(user => {
        Post.find({ user: user._id, isDeleted: false }).populate({ path: 'user', model: User }).populate({ path: 'comment', model: Comment }).sort({ $natural: -1 }).then(posts => {
            Comment.find({ user: req.session.userId }).sort({ $natural: -1 }).populate({ path: 'user', model: User }).then(comments => {
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
                        res.render('site/my-profile', { user: user, posts: posts, comments: comments, following_num: following_num, follower_num: follower_num });
                    });
                });
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
    User.findById(req.params.id).then(searchedUser => {
        Post.find({ user: searchedUser._id, isDeleted: false }).populate({ path: 'user', model: User }).populate({ path: 'comment', model: Comment }).sort({ $natural: -1 }).then(posts => {
            Comment.find({ user: req.session.userId }).sort({ $natural: -1 }).then(comments => {
                User.findById(req.session.userId).then(user => {
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
                                if (followingnum._id == req.params.id) {
                                    return followingnum;
                                }
                            });
                            const follower_result = num_of_follower.filter(followernum => {
                                if (followernum._id == req.params.id) {
                                    return followernum;
                                }
                            });
                            const following_num = following_result[0].num_of_following;
                            const follower_num = follower_result[0].num_of_follower;
                            res.render('site/user-profile', { searchedUser: searchedUser, posts: posts, comments: comments, user: user, following_num: following_num, follower_num: follower_num });
                        });
                    });
                });
            });
        });
    });
});

router.post('/changeprofilephoto', (req, res) => {
    const profileimage = req.files.profile_image;
    profileimage.mv(path.resolve(__dirname, '../public/images/profileimage', profileimage.name));
    User.findById(req.session.userId).then(user => {
        user.profile_image = `/images/profileimage/${profileimage.name}`;
        user.save();
        res.redirect(req.get('referer'));
    });
});

router.post('/changecoverphoto', (req, res) => {
    const coverimage = req.files.cover_image;
    coverimage.mv(path.resolve(__dirname, '../public/images/coverimage', coverimage.name));
    User.findById(req.session.userId).then(user => {
        user.cover_image = `/images/coverimage/${coverimage.name}`;
        user.save();
        res.redirect(req.get('referer'));
    });
});

router.post('/changepassword', (req, res) => {
    const old_password = req.body.old;
    const new_password = req.body.new;
    if(new_password.length < 7){
        req.session.sessionFlash = {
            type: 'alert alert-warning',
            message: 'Yeni şifre 7 haneden az olduğu için şifreniz değiştirilmemiştir!'
        }
        res.redirect(req.get('referer'));
        return false;
    }
    const repeat_password = req.body.repeat;
    const hash_new = hashStrSync(req.body.new);
    const hash_old = hashStrSync(req.body.old);

    User.findById(req.session.userId).then(user => {
        if (compareStrSync(old_password, user.password)) {
            if (new_password == repeat_password) {
                user.password = hash_new;
                user.save();
                req.session.sessionFlash = {
                    type: 'alert alert-success',
                    message: 'Şifreniz başarıyla değiştirilmiştir!'
                }
                res.redirect(req.get('referer'));
            } else {
                req.session.sessionFlash = {
                    type: 'alert alert-warning',
                    message: 'Yeni girilen şifreler birbiriyle uyuşmuyor!'
                }
                res.redirect(req.get('referer'));
            }
        } else {
            req.session.sessionFlash = {
                type: 'alert alert-warning',
                message: 'Eski şifreniz doğru değil!'
            }
            res.redirect(req.get('referer'));
        }
    });
});

module.exports = router;