const mongoose = require('mongoose');

const reservedBookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    reserveDate: {
        type: Date,
        default: Date.now
    },
    bookName: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    availablity: {
        type: Number,
        required: true
    }
});

const reservedbooks = mongoose.model('reservedbooks', reservedBookSchema);

module.exports = reservedbooks;
