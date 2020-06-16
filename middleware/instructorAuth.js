const Course = require('../models/Course');
const Topic = require('../models/Topic');
const Test = require('../models/Test');

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description middleware to check if the user is instructor of course
 */
const instructorAuth = async (req, res, next) => {
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

        const course = await Course.findById(courseId).select('instructor');
        if (!course) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Id' }] });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res
                .status(401)
                .json({ msg: 'Not authorized to edit course' });
        }

        next();
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ errors: [{ msg: 'Invalid Id' }] });
        }
        return res.status(500).json({ msg: 'Server Error' });
    }
};

module.exports = instructorAuth;
