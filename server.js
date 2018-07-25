// Setup
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    mongoose = require('mongoose');

var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var rfs = require('rotating-file-stream');

var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var router = express.Router();

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.use(cookieParser()); // read cookies (needed for auth)
// app.use(bodyParser('application/json')); // get information from html forms
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json({
    type: 'application/json'
})); // parse application/json

// set the view engine to ejs
app.set('view engine', 'ejs');

app.set('views', 'views');


// required for passport
app.use(session({
    secret: 'maktab13jobteam',
    resave: false,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


app.use('/', router);
// use res.render to load up an ejs view file

router.get('/login', function (req, res) {

    console.log(__dirname);
    res.render('/views/login.ejs');
});

router.get('/signup', function (req, res) {

    console.log(__dirname);
    res.render('/views/signup.ejs');
});

// router.get('/', function (req, res) {
//     // console.log("hi");
//     res.render(__dirname + "/views/dashboard.ejs");
// });



mongoose.connect("mongodb://localhost:27017/blog", {
    useNewUrlParser: true
}, () => {
    console.log('We are connected to MongoDB !');
});

// var bodyParser = require('body-parser')

app.engine('html', require('ejs').renderFile); //to ejs
app.set('view engine', 'html');

app.use(express.static('public')); // added to project according to tutorial
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// set up our express application - logger
var logDirectory = path.join(__dirname, 'logger') //logDirectory
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
// create a rotating write stream
var accessLogStream = rfs('logger.csv', {
    interval: '1d', // rotate daily
    path: logDirectory
})
// setup the logger
app.use(morgan(':remote-addr, :remote-user, [:date[web]], :method, :url, HTTP/:http-version, :response-time[digits], :status, :res[content-length], :req[header], :res[header], ":referrer", ":user-agent"', {
    stream: accessLogStream
}))
// show in commad window
app.use(logger('dev'));




var postSchema = new mongoose.Schema({
    body: String
});
var Post = mongoose.model('Post', postSchema);

// Routes
app.use(express.static(__dirname + '/public/'));

app.get("/", (req, res) => {
    Post.find({}, (err, posts) => {
        res.render('index', {
            posts: posts
        })
    });
});

app.post('/addpost', (req, res) => {
    var postData = new Post(req.body);
    postData.save().then(result => {
        res.redirect('/');
    }).catch(err => {
        res.status(400).send("Unable to save data");
    });
});

// Listen
app.listen(8080, () => {
    console.log('\nServer is Running on port 8080');
})