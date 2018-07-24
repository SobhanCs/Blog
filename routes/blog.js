var express = require('express'),
    router = express.Router();
mongoose = require('mongoose');

router.get('/', function (req, res) {
    post.find(function (err, posts) {
        if (err) {
            throw err;
        }
        res.render('blog/posts', {posts: posts});
    });
});