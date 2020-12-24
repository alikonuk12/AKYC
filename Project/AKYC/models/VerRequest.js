const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VerRequestSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    idcard_image: { type: String, default: "", required: true },
    isProcessed: { type: Boolean, default: false }
});

module.exports = mongoose.model('VerRequest', VerRequestSchema);