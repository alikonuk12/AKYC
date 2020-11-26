const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema({
    content: { type: String, require: true },
<<<<<<< HEAD
    user : { type: Schema.Types.ObjectId, ref: 'users' },
    date: { type: Date, default: Date.now },
    post_image: { type: String },
    likeNumber: { type: Number, default: 0 },
    commentNumber: { type: Number, default: 0 },
=======
    author: {type: Schema.Types.ObjectId, ref:'users', required:true},
    date: { type: Date, default: Date.now },
    photo: { type: String },
    likeNumber: { type: Number, default: 0 },
    commentNumber: { type: Number, default:0 },
>>>>>>> 2de0c6d0a23e2c11e598680fc4ffb77541bce942
    isDeleted: { type: Boolean, require: true, default: false }
});

module.exports = mongoose.model('Post', PostSchema);