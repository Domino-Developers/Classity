const mongoose = require('mongoose');

const Topic = mongoose.model('topic');

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

CourseSchema.pre('remove', async function (next) {
    try {
        const topics = await Topic.find({ _id: { $in: this.topics } });

        for (let topic of topics) {
            await topic.remove();
        }

        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('course', CourseSchema);
