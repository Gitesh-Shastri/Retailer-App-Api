const mongoose = require('mongoose');

const areaSchema = mongoose.Schema({
    area_id: mongoose.Schema.Types.ObjectId,
    area_name: {
        type: String
    },
    area_city: {
        type: String
    },
    area_state: {
        type: String
    },
    area_pincode: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now()    
    }
});

module.exports = mongoose.model('Area', areaSchema);