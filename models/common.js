const mongoose = require('mongoose');

module.exports = {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'topic'
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    number: {
        type: Number,
        default: 0
    }
};
