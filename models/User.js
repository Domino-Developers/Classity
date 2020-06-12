const mongoose = require('mongoose');

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
        type: [
            {
                courseId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'course'
                },
                courseProgressId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'courseProgress'
                }
            }
        ],
        default: []
    },
    coursesCreated: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'course'
            }
        ],
        default: []
    }
});

module.exports = mongoose.model('user', UserSchema);
