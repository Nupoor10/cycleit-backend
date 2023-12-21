const mongoose = require('mongoose');
const Challenge = require('./challengeModel');
const User = require('./userModel');
const Schema = mongoose.Schema;

const enrolledChallengeSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true
    },
    challenge: {
        type: mongoose.Types.ObjectId,
        ref: Challenge,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completionDate: {
        type: Date,
    }
}, {timestamps: true});

const EnrolledChallenge = mongoose.model('EnrolledChallenge', enrolledChallengeSchema);

module.exports = EnrolledChallenge;
