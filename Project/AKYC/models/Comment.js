const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    username: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    date: { type: Date, default: Date.now },
    post: { type: Schema.Types.ObjectId, ref: 'posts' }
});

module.exports = mongoose.model('Comment', CommentSchema);