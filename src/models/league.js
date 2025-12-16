const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Liga bakoitzak izen bat edukitzea beharezkoa da.'],
        trim: true
    },
    code: {
        type: String,
        required: true,
        uppercase: true 
    },
    country: {
        type: String,
        required: true
    },
    flagUrl: {
        type: String
    }
});

module.exports = mongoose.model('league', leagueSchema);