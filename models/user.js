const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    useremail: {
        type: String
    },
    password: {
        type: String,
        default: "-"
    },
    usercode: {
        type: String
    },
    phone: {
        type: String,
        default: "-"
    },
    first: {
        type: String,
        default: "-"    
    },
    second: {
        type: String,
        default: "-"    
    },
    username: {
        type: String,
        default: "-"    
    },
});

module.exports = mongoose.model('User', userSchema);