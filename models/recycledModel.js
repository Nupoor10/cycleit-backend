const mongoose = require('mongoose');
const Category = require('./categoryModel');
const User = require('./userModel');
const Schema = mongoose.Schema;

const recycledSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category : {
        type: mongoose.Types.ObjectId,
        ref: Category,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true
    }
}, {timestamps: true});

const RecycledItem = mongoose.model('RecycledItem', recycledSchema);

module.exports = RecycledItem;
