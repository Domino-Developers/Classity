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
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],

    topics: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'topic'
        }
    ],
    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            rating: {
                type: Number,
                required: true
            },
            text: { type: String },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],

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
