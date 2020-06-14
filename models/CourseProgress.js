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
    topicScores: [
        {
            type: Map,
            of: Number
        }
    ],
    testScores: [
        {
            type: Map,
            of: {
                score: Number,
                lastAttemptDate: {
                    type: Date,
                    default: Date.now
                }
            }
        }
    ]
});

module.exports = CourseProgress = mongoose.model(
    'courseProgress',
    CourseProgressSchema
);
