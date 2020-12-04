const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    username: { type: String },
    date: { type: Date, default: Date.now },
    post: { type: Schema.Types.ObjectId, ref: 'posts' },
    isDeleted: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Comment', CommentSchema);