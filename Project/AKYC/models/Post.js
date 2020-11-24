const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema({
    content: { type: String, require: true },
    author: {type: Schema.Types.ObjectId, ref:'users', required:true},
    date: { type: Date, default: Date.now },
    photo: { type: String },
    likeNumber: { type: Number, default: 0 },
    commentNumber: { type: Number, default:0 },
    isDeleted: { type: Boolean, require: true, default: false }
});

module.exports = mongoose.model('Post', PostSchema);