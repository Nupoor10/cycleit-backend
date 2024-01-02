const mongoose = require('mongoose');
const User = require('./userModel')
const Donation = require('./donationModel')
const Schema = mongoose.Schema;

const userDonationSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true
    },
    donation: {
        type: mongoose.Types.ObjectId,
        ref: Donation,
        required: true
    },
    status: {
        type: String,
        enum: ['initiated', 'completed']
    }
}, {timestamps: true});

const UserDonation = mongoose.model("UserDonation", userDonationSchema);

module.exports = UserDonation;
