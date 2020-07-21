const mongoose = require('mongoose');
const { topic } = require('./common');

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
    topic,
    questions: [questionSchema],
    passScore: {
        type: Number,
        required: true
    }
});

TestSchema.path('questions').discriminator(
    'smcq',
    new mongoose.Schema({
        options: {
            type: [String],
            validate: [opts => opts.length >= 2, 'Number of options should be >= 2']
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
            validate: [opts => opts.length >= 2, 'Number of options should be >= 2']
        },
        answers: {
            type: [Number],
            validate: [
                function (ans) {
                    return ans.length <= this.options.length && ans.length !== 0;
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

const removeTracking = async function (test, next) {
    try {
        // populate to get students
        await test.execPopulate({
            path: 'topic',
            select: 'course',
            populate: {
                path: 'course',
                select: 'students'
            }
        });

        // get courseId and students id
        const { id: courseId, students } = test.topic.course;
        await CourseProgress.updateMany(
            { user: { $in: students }, course: courseId },
            { $unset: { [`testScores.${test.id}`]: '' } },
            { new: true, session: this.$session() }
        );
        next();
    } catch (err) {
        next(err);
    }
};

TestSchema.post('remove', removeTracking);
TestSchema.post('findOneAndDelete', removeTracking);

module.exports = mongoose.model('test', TestSchema);
