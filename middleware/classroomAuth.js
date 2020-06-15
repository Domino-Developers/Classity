const Comment = require('../models/Comment');

/**
 *
 * @param {*} req request
 * @param {*} res result
 * @param {*} next
 * @description middleware to check if the user is either a student or instructor
 */
const classroomAuth = async (req, res, next) => {
    const { commentId } = req.params;

    if (!commentId) {
        return res.status(400).json({
            msg: 'Comment Id not found'
        });
    }

    try {
        const topicObj = await Comment.findById(commentId)
            .populate('topic', 'course')
            .populate({
                path: 'topic',
                select: 'course',
                populate: { path: 'course', select: 'students instructor' }
            })
            .select('topic');

        if (!topicObj) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Course not found' }] });
        }

        const { students, instructor } = topicObj.topic.course;
        students.push(instructor);
        const user = req.user.id;

        if (students.findIndex(s => String(s) === user) === -1) {
            return res.status(401).json({ msg: 'Not authorised' });
        }

        next();
    } catch (err) {
        console.log(err);
        if (err.kind === 'ObjectId') {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Course Id' }] });
        }
        return res.status(500).json({ msg: 'Server Error' });
    }
};

module.exports = classroomAuth;
