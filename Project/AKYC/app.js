const hostname = '127.0.0.1';
const port = '3000';
const express = require('express');
const exphbs  = require('express-handlebars');
const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('site/index');
});

app.get('/profiles', function (req, res) {
    res.render('site/profiles');
});

app.get('/user-profile', function (req, res) {
    res.render('site/user-profile');
});

app.get('/messages', function (req, res) {
    res.render('site/messages');
});

app.get('/profile-account-setting', function (req, res) {
    res.render('site/profile-account-setting');
});

app.get('/sign-in', function (req, res) {
    res.render('site/sign-in');
});

app.get('/my-profile', function (req, res) {
    res.render('site/my-profile');
});




app.listen(port, hostname, () => {
    console.log(`Server çalışıyor, http://${hostname}:${port}/`);
});