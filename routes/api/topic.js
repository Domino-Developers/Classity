const express = require('express');
const { check, validationResult } = require('express-validator');

// middlewares
const auth = require('../../middleware/auth');
const instructorAuth = require('../../middleware/instructorAuth');
const studentAuth = require('../../middleware/studentAuth');

// Models
const User = require('../../models/User');
const Topic = require('../../models/Topic');
const Comment = require('../../models/Comment');
const Test = require('../../models/Test');

// Initialize router
const router = express.Router();

// ----------------------------------- Routes ------------------------------------------

/**
 * @route		PUT api/topic/:topicId/coreResource
 * @description Add/Delete/Update core resource to topic
 * @access		private + instructorOnly
 */
router.put(
    '/:topicId/coreResource',
    [auth, instructorAuth],
    async (req, res) => {
        try {
            req.body.forEach((resource, i, arr) => {
                if (
                    !['text', 'video', 'test'].includes(resource.kind) ||
                    !resource.payload
                ) {
                    throw new Error('Bad Request');
                }

                arr[i] = {
                    kind: resource.kind,
                    text: resource.payload,
                    url: resource.payload,
                    testId: resource.payload
                };
            });

            const topic = await Topic.findOneAndUpdate(
                { _id: req.params.topicId },
                { coreResources: req.body },
                { new: true }
            );

            res.json(topic.coreResources);
        } catch (err) {
            if (err.message === 'Bad Request' || err.kind === 'ObjectId') {
                return res.status(400).json({ msg: 'Invalid data' });
            }
            res.status(500).json({ msg: 'Server Error' });
        }
    }
);

/**
 * @route		PUT api/topic/:topicId/comment/:type(resourceDump|doubt)
 * @description Add student's resource/doubt
 * @access		private + studentOnly
 */

router.put(
    '/:topicId/comment/:type(doubt|resourceDump)',
    [auth, studentAuth],
    async (req, res) => {
        try {
            const { type, topicId } = req.params;
            const user = req.user.id;
            const text = req.body.text;

            if (!text) {
                return res.status(400).json({ msg: 'Bad Request' });
            }

            const comment = new Comment({ user, topic: topicId, text });
            await comment.save();

            const newTopic = await Topic.findOneAndUpdate(
                { _id: topicId },
                { $push: { [type]: comment.id } },
                { new: true }
            ).populate(type);

            res.json(newTopic[type]);
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server Error' });
        }
    }
);
/*
 * @route		POST api/topic/:topicId/test
 * @description Add a test and get test-id
 * @access		private + instructorOnly
 */
router.post(
    '/:topicId/test',
    [
        auth,
        instructorAuth,
        [
            check('name', "Can't be empty").not().isEmpty(),
            check('questions', "questions can't be empty").not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            // Create test object
            const test = new Test({
                ...req.body,
                topic: req.params.topicId
            });

            // check for errors
            const ValidationErrors = test.validateSync();
            if (ValidationErrors) {
                const error_messages = {},
                    errors = ValidationErrors.errors;
                for (let field in errors)
                    error_messages[field] = errors[field].message;
                return res.status(400).json({ errors: error_messages });
            }

            // save the test
            await test.save();
            res.json(test);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: 'Server Error' });
        }
    }
);

/**
 * @route		DELETE api/topic/:topicId/comment/:commentId
 * @description Delete a comment
 * @access		private + studentOnly
 */

router.delete(
    '/:topicId/comment/:commentId',
    [auth, studentAuth],
    async (req, res) => {
        try {
            const { topicId, commentId } = req.params;

            const comment = await Comment.findById(commentId).select('user');

            if (!comment) {
                return res.status(400).json({ msg: 'Comment not found' });
            }

            if (String(comment.user) !== req.user.id) {
                return res
                    .status(401)
                    .json({ msg: 'Not authorized to delete comment' });
            }

            await Comment.findOneAndDelete({ _id: commentId });

            const newTopic = await Topic.findOneAndUpdate(
                { _id: topicId },
                { $pull: { doubt: commentId, resourceDump: commentId } },
                { new: true }
            );

            res.json({
                doubt: newTopic.doubt,
                resourceDump: newTopic.resourceDump
            });
        } catch (err) {
            res.status(500).json({ msg: 'Server Error' });
        }
    }
);

/**
 * @route		DELETE api/topic/:topicId/coreResource/:resourceId
 * @description Delete a core resource
 * @access		private + instructorOnly
 */

router.delete(
    '/:topicId/coreResource/:resourceId',
    [auth, instructorAuth],
    async (req, res) => {
        try {
            const { topicId, resourceId } = req.params;

            const topic = await Topic.findById(topicId).select('coreResources');
            const coreResources = topic.coreResources;

            const index = coreResources.findIndex(
                resource => String(resource.id) === resourceId
            );

            if (index === -1) {
                return res.status(400).json({ msg: 'Core resource not found' });
            }

            if (coreResources[index].kind === 'test') {
                await Test.findOneAndDelete({ _id: coreResources[i].testId });
            }

            coreResources.splice(index, 1);

            topic.coreResources = coreResources;
            await topic.save();

            res.json({ coreResources });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Server Error' });
        }
    }
);

module.exports = router;
