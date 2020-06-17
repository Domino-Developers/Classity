const mongoose = require('mongoose');

const Comment = require('./Comment');
const Test = require('./Test');

const coreResourceSchema = new mongoose.Schema(
    {},
    { discriminatorKey: 'kind' }
);

const TopicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true
    },
    coreResources: [coreResourceSchema],
    resourceDump: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
    doubt: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }
    ]
});
TopicSchema.path('coreResources').discriminator(
    'text',
    new mongoose.Schema({ text: { type: String, required: true } })
);
TopicSchema.path('coreResources').discriminator(
    'video',
    new mongoose.Schema({ url: { type: String, required: true } })
);
TopicSchema.path('coreResources').discriminator(
    'test',
    new mongoose.Schema({
        testId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'test',
            required: true
        }
    })
);

TopicSchema.pre('remove', async function (next) {
    try {
        const commentIds = [].concat(this.doubt, this.resourceDump);

        const comments = await Comment.find({ _id: { $in: commentIds } });

        for (let comment of comments) {
            await comment.remove();
        }

        const testIds = this.coreResources.filter(
            resource => resource.kind === 'test'
        );

        // get tests with students
        const tests = await Test.find({ _id: { $in: testIds } })
            .populate({ path: 'topic', select: 'course' })
            .populate({
                path: 'topic',
                select: 'course',
                populate: { path: 'course', select: 'students' }
            });

        for (let test of tests) {
            await test.remove();
        }

        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('topic', TopicSchema);
