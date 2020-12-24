const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, default: "akycadmin" },
    email: { type: String, required: true, unique: true, default: "akyc_admin@gmail.com" },
    password: { type: String, required: true, default: "akyc2020" }
});

module.exports = mongoose.model('Admin', AdminSchema);