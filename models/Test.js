const mongoose = require('mongoose');

// models
const CourseProgress = require('./CourseProgress');

const questionSchema = new mongoose.Schema(
    {
        kind: {
            type: String,
            enum: ['smcq', 'mmcq', 'short', 'numerical'],
            required: true
        },
        question: {
            type: String,
            required: [true, "Question can't be empty"]
        }
    },
    { discriminatorKey: 'kind' }
);

const TestSchema = new mongoose.Schema({
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'topic'
    },
    name: {
        type: String,
        required: [true, "Name can't be empty"]
    },
    questions: [questionSchema]
});

TestSchema.path('questions').discriminator(
    'smcq',
    new mongoose.Schema({
        options: {
            type: [String],
            validate: [
                opts => opts.length >= 2,
                'Number of options should be >= 2'
            ]
        },
        answer: {
            type: Number,
            required: [true, "Answer can't be empty"]
        }
    })
);

TestSchema.path('questions').discriminator(
    'mmcq',
    new mongoose.Schema({
        options: {
            type: [String],
            validate: [
                opts => opts.length >= 2,
                'Number of options should be >= 2'
            ]
        },
        answers: {
            type: [Number],
            validate: [
                function (ans) {
                    return (
                        ans.length <= this.options.length && ans.length !== 0
                    );
                },
                'Answers should be there and <= number of options'
            ]
        }
    })
);

TestSchema.path('questions').discriminator(
    'short',
    new mongoose.Schema({
        answer: {
            type: String,
            required: [true, "Answer can't be empty"]
        }
    })
);

TestSchema.path('questions').discriminator(
    'numerical',
    new mongoose.Schema({
        answer: {
            from: {
                type: Number,
                required: [true, 'From is required']
            },
            to: {
                type: Number,
                required: [true, 'To is required']
            }
        }
    })
);

TestSchema.pre('remove', async function (next) {
    const { id: courseId, students } = this.topic.course;
    // Remove from tracking
    try {
        await CourseProgress.updateMany(
            { user: { $in: students }, course: courseId },
            { $unset: { [`testScores.${this.id}`]: '' } },
            { new: true }
        );
        next();
    } catch (err) {
        next(err);
    }
});
module.exports = mongoose.model('test', TestSchema);
