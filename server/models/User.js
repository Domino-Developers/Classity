const mongoose = require('mongoose');
const { course, text } = require('./common');

const Course = require('./Course');
const CourseProgress = require('./CourseProgress');
const getDateString = require('./../utils/getDateString');

const UserSchema = new mongoose.Schema({
    name: text,
    password: text,
    email: text,
    avatar: text,
    coursesEnrolled: {
        type: Map,
        of: mongoose.Schema.Types.ObjectId,
        default: {}
    },
    coursesCreated: [course],
    energy: {
        type: Number,
        default: 4
    },
    score: {
        type: Map,
        of: Number,
        default: { [getDateString()]: 0 }
    },
    contribution: {
        type: Map,
        of: Number,
        default: { [getDateString()]: 0 }
    },
    inactive: {
        type: Boolean,
        default: true
    },
    verifyingToken: {
        type: {
            for: String,
            token: String,
            expDate: Date
        }
    }
});

UserSchema.pre('remove', async function (next) {
    const coursePromise = Course.find({
        _id: { $in: this.coursesCreated }
    }).session(this.$session());

    const progressPromise = CourseProgress.find({
        _id: { $in: [...this.coursesEnrolled.values()] }
    }).session(this.$session());

    const [coursesCreated, coursesProgress] = await Promise.all([coursePromise, progressPromise]);

    const coursePromises = [];
    for (let course of coursesCreated) {
        coursePromises.push(course.remove());
    }

    const progressPromises = [];
    for (let progress of coursesProgress) {
        progressPromises.push(progress.remove());
    }

    const enrollPromises = [];
    for (let courseId of [...this.coursesEnrolled.keys()]) {
        enrollPromises.push(
            Course.findOneAndUpdate(
                { _id: courseId },
                { $pull: { students: this.id } },
                { session: this.$session() }
            )
        );
    }

    await Promise.all([].concat(coursePromises, progressPromises, enrollPromises));

    next();
});

module.exports = mongoose.model('user', UserSchema);
