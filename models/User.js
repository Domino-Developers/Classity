const mongoose = require('mongoose');

const Course = mongoose.model('course');
const CourseProgress = mongoose.model('courseProgress');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    coursesEnrolled: {
        type: Map,
        of: mongoose.Schema.Types.ObjectId,
        default: {}
    },
    coursesCreated: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'course'
        }
    ]
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
