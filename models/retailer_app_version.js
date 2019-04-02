const mongoose = require('mongoose');

const AppVersionSchema = mongoose.Schema({
    version_name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('retailer_app_version', AppVersionSchema);