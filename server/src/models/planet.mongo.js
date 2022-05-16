const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
    keplerName: { // same as front end
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('PLanet', planetSchema);