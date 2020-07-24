const express = require('express');
const mongoose = require('mongoose');

const getDateString = require('../../utils/getDateString');

// middlewares
const classroomAuth = require('../../middleware/classroomAuth');

// Models
const Comment = require('../../models/Comment');
const User = require('../../models/User');

// Initialize router
const router = express.Router();

// ----------------------------------- Routes ------------------------------------------

/**
 * @route		PUT api/comment/:commentId/like
 * @description Like a comment
 * @access		private + classroomOnly
 */
router.put('/:commentId/like', classroomAuth, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const comment = await Comment.findById(req.params.commentId);

            if (comment.likes.findIndex(user => String(user) === req.user.id) === -1) {
                comment.likes.push(req.user.id);
                const commentPromise = comment.save({ session });

                const userPromise = User.findOneAndUpdate(
                    { _id: comment.user },
                    { $inc: { [`contribution.${getDateString()}`]: 5 } },
                    { session }
                );

                await Promise.all([commentPromise, userPromise]);

                res.json(comment.likes);
            } else {
                res.status(400).json({
                    errors: [{ msg: 'Comment already liked' }]
                });
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    } finally {
        session.endSession();
    }
});

/**
 * @route		DELETE api/comment/:commentId/like
 * @description Unlike a comment
 * @access		private + classroomOnly
 */
router.delete('/:commentId/like', classroomAuth, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const comment = await Comment.findById(req.params.commentId);
            const index = comment.likes.findIndex(user => String(user) === req.user.id);

            if (index !== -1) {
                comment.likes.splice(index, 1);

                const commentPromise = comment.save({ session });

                const userPromise = User.findOneAndUpdate(
                    { _id: comment.user },
                    { $inc: { [`contribution.${getDateString()}`]: -5 } },
                    { session }
                );

                await Promise.all([commentPromise, userPromise]);

                res.json(comment.likes);
            } else {
                res.status(400).json({ errors: [{ msg: 'Comment not liked' }] });
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    } finally {
        session.endSession();
    }
});

/**
 * @route		PUT api/comment/:commentId/reply
 * @description Reply to a comment
 * @access		private + classroomOnly
 */
router.put('/:commentId/reply', classroomAuth, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const text = req.body.text;
            const user = req.user.id;

            if (!text) return res.status(400).json({ errors: [{ msg: 'No text found' }] });

            const newComment = await Comment.findOneAndUpdate(
                { _id: req.params.commentId },
                { $push: { reply: { user, text } } },
                { new: true, session }
            );

            res.json(newComment.reply);
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    } finally {
        session.endSession();
    }
});

/**
 * @route		DELETE api/comment/:commentId/reply/:replyId
 * @description Delete a reply
 * @access		private + classroomOnly
 */
router.delete('/:commentId/reply/:replyId', classroomAuth, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const { commentId, replyId } = req.params;

            const comment = await Comment.findById(commentId).select('reply');
            const replyArr = comment.reply;

            const index = replyArr.findIndex(reply => String(reply.id) === replyId);

            if (index === -1) return res.status(400).json({ errors: [{ msg: 'Reply not found' }] });

            if (String(replyArr[index].user) !== req.user.id)
                return res
                    .status(401)
                    .json({ errors: [{ msg: 'Not authorized to delete reply' }] });

            replyArr.splice(index, 1);

            comment.reply = replyArr;
            await comment.save({ session });

            res.json(replyArr);
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    } finally {
        session.endSession();
    }
});

module.exports = router;
