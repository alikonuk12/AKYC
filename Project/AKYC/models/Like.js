const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LikeSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    post: { type: Schema.Types.ObjectId, ref: 'posts' }
});

module.exports = mongoose.model('Like', LikeSchema);