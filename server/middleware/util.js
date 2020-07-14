const jwt = require('jsonwebtoken');

const Course = require('../models/Course');
const Topic = require('../models/Topic');
const Test = require('../models/Test');
const Comment = require('../models/Comment');

/**
 * @param {*} req
 * @description function to get course object
 */
const getCourse = async req => {
    const { courseId, topicId, testId, commentId } = req.params;
    const toSelect = 'instructor students';
    let course;

    if (courseId) {
        course = await Course.findById(courseId).select(toSelect);
    } else if (topicId) {
        const topic = await Topic.findById(topicId).select('course').populate('course', toSelect);
        if (!topic) {
            const e = new Error('Invalid Id');
            e.kind = 'BadRequest';
            throw e;
        }

        course = topic.course;
    } else if (testId) {
        const test = await Test.findById(testId)
            .populate('topic', 'course')
            .populate({
                path: 'topic',
                select: 'course',
                populate: { path: 'course', select: toSelect }
            })
            .select('topic');
        if (!test) {
            const e = new Error('Invalid Id');
            e.kind = 'BadRequest';
            throw e;
        }

        course = test.topic.course;
    } else if (commentId) {
        const comment = await Comment.findById(commentId)
            .populate('topic', 'course')
            .populate({
                path: 'topic',
                select: 'course',
                populate: { path: 'course', select: toSelect }
            })
            .select('topic');
        if (!comment) {
            const e = new Error('Invalid Id');
            e.kind = 'BadRequest';
            throw e;
        }

        course = comment.topic.course;
    } else {
        const e = new Error('No Id found to validate student/instructor');
        e.kind = 'BadRequest';
        throw e;
    }

    if (!course) {
        const e = new Error('Invalid Id');
        e.kind = 'BadRequest';
        throw e;
    }

    req.course = course;
    return course;
};

/**
 * @param {*} req
 * @description function to check if the user is a student of the course
 */
const isStudent = async req => {
    const { students } = req.course ? req.course : await getCourse(req);

    const index = students.findIndex(id => String(id) === req.user.id);

    return index !== -1;
};

/**
 * @param {*} req
 * @description function to check if the user is the instructor of the course
 */
const isInstructor = async req => {
    const { instructor } = req.course ? req.course : await getCourse(req);

    return String(instructor) === req.user.id;
};

/**
 * @param {*} req
 * @description function to verify & attach token
 */
const verify = req => {
    const token = req.header('x-auth-token');

    if (!token) {
        const e = new Error('Token not found');
        e.kind = 'NotAuthorized';
        throw e;
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded.user;
    } catch (err) {
        const e = new Error('Invalid token');
        e.kind = 'NotAuthorized';
        throw e;
    }
};

module.exports = { verify, isStudent, isInstructor };
