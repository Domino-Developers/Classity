const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { course, text, date } = require('./common');

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
    verifyingToken: {
        type: {
            reason: String,
            token: String,
            expDate: Date
        }
    },
    nextTokenRequest: date
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

UserSchema.methods.generateJWT = function () {
    const payload = {
        user: {
            id: this._id
        }
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 36000000 });
    return token;
};

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.emailVerified = function () {
    return !this.verifyingToken || this.verifyingToken.reason !== 'email-verify';
};
module.exports = mongoose.model('user', UserSchema);
