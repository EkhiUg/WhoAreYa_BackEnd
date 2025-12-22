const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    leagueId: {
        type: Number,
        required: true,
        ref: 'League'
    },
    logoUrl: {
        type: String
    },
    country: {
        type: String,
        required: true
    },
    stadium: {
        type: String
    }
});

module.exports = mongoose.model('Team', teamSchema);