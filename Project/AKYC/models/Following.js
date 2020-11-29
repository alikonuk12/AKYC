const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowingSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    following: { type: Schema.Types.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('Following', FollowingSchema);