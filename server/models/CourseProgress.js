const mongoose = require('mongoose');
const { user, course, date, number } = require('./common');

const CourseProgressSchema = new mongoose.Schema({
    user,
    course,
    precentageCompleted: number,
    lastStudied: date,
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
    }
});

CourseProgressSchema.pre('findOneAndUpdate', function () {
    this.set({ lastStudied: Date.now() });
});

module.exports = mongoose.model('courseProgress', CourseProgressSchema);
