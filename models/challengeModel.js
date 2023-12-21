const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const challengeSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficultyLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true,
    },
    points: {
        type: Number,
        required: true,
    }
}, {timestamps: true});

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
