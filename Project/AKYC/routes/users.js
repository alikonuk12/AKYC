const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/sign-in', (req, res) => {
    res.render('site/sign-in');
});

router.post('/sign-in', (req, res) => {
    const {username, password} = req.body;
    User.findOne({username}, (error, user) => {
        if(user){
            if(user.password == password){
                req.session.userId = user._id;
                res.redirect('/');
            } else{
                res.redirect('sign-in');
            }
        } else{
            res.redirect('sign-up');
        }
    });
});

router.get('/sign-up', (req, res) => {
    res.render('site/sign-up');
});

router.post('/sign-up', (req, res) =>{
    User.create(req.body, (error, user) =>{
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

module.exports = router;