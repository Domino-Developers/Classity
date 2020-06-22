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
