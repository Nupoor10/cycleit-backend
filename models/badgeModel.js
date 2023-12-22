const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const badgeSchema = new Schema({
    name: {
        type: String, 
        required: true
    },
    img: {
        type: String, 
        required: true
    },
    points: {
        type: Number,
        required: true
    }
}, {timestamps: true});

const Badge = mongoose.model('Badge', badgeSchema);

module.exports = Badge;
