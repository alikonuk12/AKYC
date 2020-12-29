const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const txtprefix = "prefix";

function hashStrSync(txtSaf) {
    return bcrypt.hashSync(`${txtprefix}${txtSaf}`, saltRounds);
}

function compareStrSync(txtSaf, txtHashli) {
    return bcrypt.compareSync(`${txtprefix}${txtSaf}`, txtHashli);
}

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

router.get('/forgotpassword', (req, res) => {
    res.render('site/forgot-password');
});

router.post('/forgotpassword', (req, res) => {
    const generated_pass = generatePassword();
    const new_pass = hashStrSync(generated_pass);
    User.findOne({ email: req.body.email }, function (err, user) {
        user.password = new_pass;
        user.save();
    });

    const outputHTML = `
    
    <h2>Şifre Yenileme</h2>
    <p>${req.body.email} ile şifre sıfırlama isteğinde bulundun, aşağıdaki yeni şifreni kullanarak hesabına erişebilirsin.</p>
    <p>Yeni şifreniz: ${generated_pass}</p>
    `;

    "use strict";
    const nodemailer = require("nodemailer");

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "akyc.project@gmail.com", // generated ethereal user
                pass: "dflatvztxtdczgrp", // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `Şifre Yenileme Talebi <akyc.project@gmail.com>`, // sender address
            to: `${req.body.email}`, // list of receivers
            subject: `Şifre Yenileme Talebi`, // Subject line
            //text: `Hello World!`, // plain text body
            html: outputHTML, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        req.session.sessionFlash = {
            type: "alert alert-success",
            message: "Mailiniz başarılı bir şekilde gönderildi."
        };

        res.redirect("/");
    }

    main().catch(console.error);
});

module.exports = router;