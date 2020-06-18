const mongoose = require('mongoose');
const { user, topic, text, date } = require('./common');

const CommentSchema = new mongoose.Schema({
    user,
    topic,
    text,
    likes: [user],
    date,
    reply: [{ user, text, date }]
});

module.exports = mongoose.model('comment', CommentSchema);
