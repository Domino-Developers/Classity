const mongoose = require('mongoose');
const { course, text, number } = require('./common');

const Course = require('./Course');
const CourseProgress = require('./CourseProgress');

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
    coursesCompleted: {
        type: Map,
        of: mongoose.Schema.Types.ObjectId,
        default: {}
    },
    coursesCreated: [course],
    score: number,
    energy: {
        type: Number,
        default: 4
    },
    contribution: number
});

UserSchema.pre('remove', async function (next) {
    const coursePromise = Course.find({
        _id: { $in: this.coursesCreated }
    });

    const progressPromise = CourseProgress.find({
        _id: { $in: [...this.coursesEnrolled.values()] }
    });

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
            Course.findOneAndUpdate({ _id: courseId }, { $pull: { students: this.id } })
        );
    }

    await Promise.all([].concat(coursePromises, progressPromises, enrollPromises));

    next();
});

module.exports = mongoose.model('user', UserSchema);
