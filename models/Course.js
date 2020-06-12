const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: true
    },
    students: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }
        ],
        default: []
    },
    topics: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'topic'
            }
        ],
        default: []
    },
    reviews: {
        type: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'user'
                },
                rating: { type: Number },
                text: { type: String },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        default: []
    },
    avgRating: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('course', CourseSchema);
