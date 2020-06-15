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
            if (err.message === 'Bad Request') {
                return res.status(400).json({ msg: err.message });
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

module.exports = router;
