const Admin = require("../models/Admin");

module.exports = {
    isAdmin: (id => {
        if (id) {
            return true;
        }
        return false;
    })
}