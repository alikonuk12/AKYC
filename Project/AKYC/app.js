const hostname = '127.0.0.1';
const port = '3000';
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo');

mongoose.connect('mongodb://127.0.0.1/akyc_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const MongoStore = connectMongo(session);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

//Pop-up Middleware
app.use((req, res, next) => {
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

app.use(express.static('public'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Display Link Middleware
app.use((req, res, next) => {
    const { userId } = req.session;
    if (userId) {
        res.locals = {
            displayLink: true
        }
    } else {
        res.locals = {
            displayLink: false
        }
    }
    next();
});

const main = require('./routes/main');
const users = require('./routes/users');
app.use('/', main);
app.use('/users', users);



app.listen(port, hostname, () => {
    console.log(`Server çalışıyor, http://${hostname}:${port}/`);
});