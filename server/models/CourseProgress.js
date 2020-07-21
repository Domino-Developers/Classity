const mongoose = require('mongoose');
const { user, course, date, number } = require('./common');

const CourseProgressSchema = new mongoose.Schema({
    user,
    course,
    lastStudied: date,
    startedOn: date,
    streak: number,
    testScores: {
        type: Map,
        of: {
            score: Number,
            lastAttemptDate: date
        },
        default: {}
    },
    topicStatus: {
        type: Map,
        of: [mongoose.Schema.Types.ObjectId],
        default: {}
    },
    completedOnce: {
        type: Boolean,
        default: false
    }
});

CourseProgressSchema.pre('findOneAndUpdate', function () {
    this.set({ lastStudied: Date.now() });
});

module.exports = mongoose.model('courseProgress', CourseProgressSchema);
