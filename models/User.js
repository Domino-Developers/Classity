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

module.exports = mongoose.model('user', UserSchema);
