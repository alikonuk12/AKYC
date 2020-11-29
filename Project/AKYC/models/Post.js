const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema({
    content: { type: String, required: true },
    user : { type: Schema.Types.ObjectId, ref: 'users' },
    date: { type: Date, default: Date.now },
    post_image: { type: String },
    likeNumber: { type: Number, default: 0 },
    commentNumber: { type: Number, default: 0 },
    isDeleted: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Post', PostSchema);