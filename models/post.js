var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    image: {type: String, required: true},
    star: {type: String},
    seen: {type: String},
    date: {type: String},
    author: {
        id: {type: mongoose.Schema.types.ObjectId, ref: 'User'},
        username: {type: String, required: true}
    }
});

module.exports = mongoose.model('Post', postSchema);
