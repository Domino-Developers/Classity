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

            res.send(topic.coreResources);
        } catch (err) {
            if (err.message === 'Bad Request') {
                return res.status(400).json({ msg: err.message });
            }
            res.status(500).json({ msg: 'Server Error' });
        }
    }
);

/**
 * @route		PUT api/topic/:topicId/comment/:kind(resourceDump|doubt)
 * @description Add/Update user's resource/doubt
 * @access		private + studentOnly
 */

router.put(
    '/:topicId/comment/:kind(doubt|resourceDump)',
    [auth, studentAuth],
    async (req, res) => {
        try {
            const { kind, topicId } = req.params;
            const user = req.user.id;
            const text = req.body.text;

            if (!text) {
                return res.status(400).json({ msg: 'Bad Request' });
            }

            const arrObj = await Topic.findById(topicId)
                .populate({ path: kind })
                .select(kind);
            const arr = arrObj[kind];
            const index = arr.findIndex(e => String(e.user) === user);

            if (index === -1) {
                const comment = new Comment({ user, topic: topicId, text });
                await comment.save();
                arr.push(comment.id);
                const newTopic = await Topic.findOneAndUpdate(
                    { _id: topicId },
                    { [kind]: arr },
                    { new: true }
                );
                arr = newTopic[kind];
            } else {
                arr[index].text = text;
                await Comment.findOneAndUpdate(
                    { _id: arr[index].id },
                    { text }
                );
            }

            res.send(arr);
        } catch (err) {
            res.status(500).json({ msg: 'Server Error' });
        }
    }
);

module.exports = router;
