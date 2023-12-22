const mongoose = require('mongoose');
const Badge = require('./badgeModel');
const Schema = mongoose.Schema

const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true, 
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    totalPoints: {
        type: Number
    },
    badges: [{
        type: mongoose.Types.ObjectId,
        ref: Badge
    }],
    totalBadges: {
        type: Number,
        virtual: true,
        get() {
          return this.badges.length;
        },
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;
