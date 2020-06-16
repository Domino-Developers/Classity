const Course = require('../models/Course');
const Topic = require('../models/Topic');
const Test = require('../models/Test');

/**
 *
 * @param {*} req request
 * @param {*} res result
 * @param {*} next
 * @description middleware to check if the student is enrolled in course or not
 */
const studentAuth = async (req, res, next) => {
    let { courseId, topicId, testId } = req.params;

    if (!courseId && !topicId && !testId) {
        return res.status(400).json({
            msg: 'Course Id or Topic Id or Test Id not found'
        });
    }

    try {
        if (!courseId) {
            if (!topicId) {
                const test = await Test.findById(testId).select('topic');
                if (!test) {
                    return res
                        .status(400)
                        .json({ errors: [{ msg: 'Invalid Id' }] });
                }
                topicId = test.topic;
            }
            const topic = await Topic.findById(topicId).select('course');
            if (!topic) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Id' }] });
            }
            courseId = topic.course;
        }

        const course = await Course.findById(courseId).select('students');
        if (!course) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Id' }] });
        }
        if (
            course.students.filter(id => id.toString() === req.user.id)
                .length === 0
        ) {
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

module.exports = studentAuth;
