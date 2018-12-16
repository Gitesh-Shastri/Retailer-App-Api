const mongoose = require('mongoose');

const pharmaSchema = mongoose.Schema({
	code: {
        type: Number
    }
});

module.exports = mongoose.model('USerCode', pharmaSchema);