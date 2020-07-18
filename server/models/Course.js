const mongoose = require('mongoose');
const { user, topic, text, date, number } = require('./common');

const Topic = require('./Topic');

const CourseSchema = new mongoose.Schema({
    name: text,
    instructor: user,
    createdDate: date,
    modifiedDate: date,
    description: text,
    imageURL: text,
    students: [user],
    topics: [topic],
    reviews: [
        {
            user,
            rating: {
                type: Number,
                required: true
            },
            text: { type: String },
            date
        }
    ],

    avgRating: number,
    tags: {
        type: [String],
        default: []
    },
    points: number,
    threshold: {
        type: Number,
        default: 100
    }
});

CourseSchema.pre('remove', async function (next) {
    try {
        const topics = await Topic.find({ _id: { $in: this.topics } });

        const topicPromises = [];
        for (let topic of topics) {
            topicPromises.push(topic.remove());
        }

        await Promise.all(topicPromises);

        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('course', CourseSchema);
