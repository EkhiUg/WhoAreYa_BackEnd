const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Izena derrigorrezkoa da.'],
        trim: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    teamId: {
        type: Number,
        required: true,
        ref: 'Team'
    },
    leagueId: {
        type: Number,
        required: true,
        ref: 'League'
    },
    position: {
        type: String,
        required: true,
        enum: ['GK', 'DF', 'MF', 'FW'], 
        uppercase: true
    },
    number: {
        type: Number,

    },
    imageUrl: {
        type: String
    }
});

module.exports = mongoose.model('player', playerSchema);