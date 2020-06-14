const Course = require('../models/Course');

/**
 *
 * @param {*} req request
 * @param {*} res result
 * @param {*} next
 * @description middleware to check if the student is enrolled in course or not
 */
const studentAuth = async (req, res, next) => {
    const courseId = req.params.courseId;

    if (!courseId) {
        return res.status(400).json({ msg: 'Course Id not found' });
    }
    try {
        const course = await Course.findById(courseId).select('students');
        if (!course) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'course_id not found' }] });
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
                .json({ errors: [{ msg: 'incorrect course_id' }] });
        }
        return res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = studentAuth;
