const mongoose = require('mongoose');

const CourseProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    },
    precentageCompleted: {
        type: Number,
        default: 0
    },
    lastStudied: {
        type: Date,
        default: Date.now
    },
    streak: {
        type: Number,
        default: 0
    },
    testScores: {
        type: Map,
        of: {
            score: Number,
            lastAttemptDate: {
                type: Date,
                default: Date.now
            }
        },
        default: {}
    }
});

module.exports = mongoose.model('courseProgress', CourseProgressSchema);
