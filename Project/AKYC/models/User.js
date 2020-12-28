const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthdate: { type: Date },
    city: { type: String, required: true },
    job: { type: String, required: true },
    password: { type: String, required: true },
    profile_image: { type: String },
    cover_image: { type: String },
    follower: { type: Schema.Types.ObjectId, ref: 'followers' },
    following: { type: Schema.Types.ObjectId, ref: 'followings' },
    isVerified: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model('User', UserSchema);