const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowerSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    follower: { type: Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('Follower', FollowerSchema);