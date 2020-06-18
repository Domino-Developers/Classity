const mongoose = require('mongoose');
const { course, text } = require('./common');

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
    coursesCreated: [course]
});

UserSchema.pre('remove', async function (next) {
    const coursesCreated = await Course.find({
        _id: { $in: this.coursesCreated }
    });

    for (let course of coursesCreated) {
        await course.remove();
    }

    const coursesProgress = await CourseProgress.find({
        _id: { $in: [...this.coursesEnrolled.values()] }
    });

    for (let progress of coursesProgress) {
        await progress.remove();
    }

    for (let courseId of [...this.coursesEnrolled.keys()]) {
        await Course.findOneAndUpdate(
            { _id: courseId },
            { $pull: { students: this.id } }
        );
    }

    next();
});

module.exports = mongoose.model('user', UserSchema);
