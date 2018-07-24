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
var rfs = require('rotating-file-stream')


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