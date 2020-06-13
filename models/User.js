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
    coursesEnrolled: [
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
    coursesCreated: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'course'
        }
    ]
});

module.exports = mongoose.model('user', UserSchema);
