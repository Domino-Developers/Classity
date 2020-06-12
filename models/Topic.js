const mongoose = require('mongoose');

const coreResourceSchema = new mongoose.Schema(
    {},
    { discriminatorKey: 'kind' }
);

const TopicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    coreResources: [coreResourceSchema],
    resourceDump: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'resource'
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

module.exports = mongoose.model('topic', TopicSchema);
