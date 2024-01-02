const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donationSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please provide a title"]
    },
    description: {
        type: String,
        required: [true, "Please provide a description"]
    },
    goalAmount: {
        type: Number,
        required: [true, "Please provide a goal amount"]
    },
    amountRaised: {
        type: Number,
    },
    organizer: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    percentageRaised: {
        type: Number,
        virtual: true,
        get() {
            return (this.amountRaised / this.goalAmount)*100
        }
    }
}, {timestamps: true});

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
