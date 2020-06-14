const Course = require('../models/Course');
const Topic = require('../models/Topic');

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description middleware to check if the user is instructor of course
 */
const instructorAuth = async (req, res, next) => {
    let { courseId, topicId } = req.params;

    if (!courseId && !topicId) {
        return res.status(400).json({
            msg: 'Course Id or Topic Id not found'
        });
    }

    try {
        if (!courseId) {
            const topic = await Topic.findById(topicId).select('course');
            courseId = topic.course;
        }

        const course = await Course.findById(courseId).select('instructor');
        if (!course) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Course not found' }] });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res
                .status(401)
                .json({ msg: 'Not authorized to edit course' });
        }

        next();
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Course Id' }] });
        }
        return res.status(500).json({ msg: 'Server Error' });
    }
};

module.exports = instructorAuth;
