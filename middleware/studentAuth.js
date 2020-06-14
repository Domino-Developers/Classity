const Course = require('../models/Course');

/**
 *
 * @param {*} req request
 * @param {*} res result
 * @param {*} next
 * @description middleware to check if the student is enrolled in course or not
 */
const studentAuth = async (req, res, next) => {
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

        const course = await Course.findById(courseId).select('students');
        if (!course) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Course not found' }] });
        }
        if (
            course.students.filter(id => id.toString() === req.user.id)
                .length === 0
        ) {
            return res.status(401).json({ msg: 'Not authorised' });
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

module.exports = studentAuth;
