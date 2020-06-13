const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'topic'
    },
    questions: [{ question: String, answers: [String] }]
});

module.exports = mongoose.model('test', TestSchema);
