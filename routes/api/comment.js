const express = require('express');

// middlewares
const classroomAuth = require('../../middleware/classroomAuth');

// Models
const Comment = require('../../models/Comment');

// Initialize router
const router = express.Router();

// ----------------------------------- Routes ------------------------------------------

/**
 * @route		PUT api/comment/:commentId/like
 * @description Like a comment
 * @access		private + classroomOnly
 */
router.put('/:commentId/like', classroomAuth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (
            comment.likes.findIndex(user => String(user) === req.user.id) === -1
        ) {
            comment.likes.push(req.user.id);

            await comment.save();

            res.json(comment.likes);
        } else {
            res.status(400).json({
                errors: [{ msg: 'Comment already liked' }]
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route		DELETE api/comment/:commentId/like
 * @description Unlike a comment
 * @access		private + classroomOnly
 */
router.delete('/:commentId/like', classroomAuth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        const index = comment.likes.findIndex(
            user => String(user) === req.user.id
        );

        if (index !== -1) {
            comment.likes.splice(index, 1);

            await comment.save();

            res.json(comment.likes);
        } else {
            res.status(400).json({ errors: [{ msg: 'Comment not liked' }] });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route		PUT api/comment/:commentId/reply
 * @description Reply to a comment
 * @access		private + classroomOnly
 */
router.put('/:commentId/reply', classroomAuth, async (req, res) => {
    try {
        const text = req.body.text;
        const user = req.user.id;

        if (!text) {
            return res.status(400).json({ errors: [{ msg: 'No text found' }] });
        }

        const newComment = await Comment.findOneAndUpdate(
            { _id: req.params.commentId },
            { $push: { reply: { user, text } } },
            { new: true }
        );

        res.json(newComment.reply);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route		DELETE api/comment/:commentId/reply/:replyId
 * @description Delete a reply
 * @access		private + classroomOnly
 */
router.delete('/:commentId/reply/:replyId', classroomAuth, async (req, res) => {
    try {
        const { commentId, replyId } = req.params;

        const comment = await Comment.findById(commentId).select('reply');
        const replyArr = comment.reply;

        const index = replyArr.findIndex(reply => String(reply.id) === replyId);

        if (index === -1) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Reply not found' }] });
        }

        if (String(replyArr[index].user) !== req.user.id) {
            return res
                .status(401)
                .json({ errors: [{ msg: 'Not authorized to delete reply' }] });
        }

        replyArr.splice(index, 1);

        comment.reply = replyArr;
        await comment.save();

        res.json(replyArr);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

module.exports = router;
