const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'topic'
    },
    text: {
        type: String,
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    date: {
        type: Date,
        default: Date.now
    },
    reply: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            text: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

module.exports = mongoose.model('comment', CommentSchema);
