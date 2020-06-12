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
    courses: {
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
    }
});

module.exports = mongoose.model('user', UserSchema);
