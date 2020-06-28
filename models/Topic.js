const mongoose = require('mongoose');
const { course, comment, text } = require('./common');

const Comment = require('./Comment');
const Test = require('./Test');

const coreResourceSchema = new mongoose.Schema(
    { name: text },
    { discriminatorKey: 'kind' }
);

const TopicSchema = new mongoose.Schema({
    name: text,
    course,
    coreResources: [coreResourceSchema],
    resourceDump: [comment],
    doubt: [comment]
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

        // get tests
        const tests = await Test.find({ _id: { $in: testIds } });

        for (let test of tests) {
            await test.remove();
        }

        next();
    } catch (err) {
        next(err);
    }
});

async function updateCourse(topic, next) {
    try {
        await mongoose.model('course').findOneAndUpdate(
            { _id: topic.course },
            {
                modifiedDate: Date.now()
            }
        );
        next();
    } catch (err) {
        next(err);
    }
}

TopicSchema.post('save', updateCourse);

TopicSchema.post('findOneAndUpdate', updateCourse);

module.exports = mongoose.model('topic', TopicSchema);
