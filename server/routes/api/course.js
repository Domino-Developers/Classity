const express = require('express');
const { check, oneOf, validationResult } = require('express-validator');

// middlewares
const auth = require('../../middleware/auth');
const instructorAuth = require('../../middleware/instructorAuth');
const studentAuth = require('../../middleware/studentAuth');

// Models
const Course = require('../../models/Course');
const User = require('../../models/User');
const Topic = require('../../models/Topic');
const CourseProgress = require('../../models/CourseProgress');
const { course } = require('../../models/common');
const { verifyToken } = require('../../utils/tokenVerifier');

// Initialize router
const router = express.Router();

// ----------------------------------- Routes ------------------------------------------

/**
 * @route		POST api/course
 * @description Add course
 * @access		private
 */
router.post(
    '/',
    [
        auth,
        [
            check('name', "Course name can't be empty").not().isEmpty(),
            check('description', "Description can't be empty").not().isEmpty(),
            check('imageURL', 'imageURL is req').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        try {
            const courseData = {
                ...req.body,
                instructor: req.user.id
            };
            const course = new Course(courseData);
            const coursePromise = course.save();
            const userPromise = User.findOneAndUpdate(
                { _id: req.user.id },
                {
                    $push: {
                        coursesCreated: {
                            $each: [course.id],
                            $position: 0
                        }
                    }
                }
            );

            await Promise.all([coursePromise, userPromise]);

            res.json(course);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        }
    }
);

/**
 * @route		GET api/course
 * @description Get course names, instructor, tags, avgRating
 * @access		public
 */
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('instructor', 'name -_id')
            .select(['name', 'instructor', 'tags', 'avgRating']);
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route		GET api/course/custom
 * @description Get Map of courses and courseprogress of courseIds passed
 * @access		private
 */
router.get('/custom', auth, async (req, res) => {
    if (!req.query.source) return res.status(400).json({ errors: [{ msg: 'Bad request' }] });

    let { source: coursesReqJson } = req.query;
    const coursesReq = JSON.parse(coursesReqJson);

    try {
        const courseIds = coursesReq.map(c => c._id);
        const courseProgressIds = coursesReq.map(c => c.courseProgressId).filter(c => c);

        const coursePromise = Course.find({ _id: { $in: courseIds } })
            .populate('instructor', 'name -_id')
            .select(['name', 'instructor', 'tags', 'avgRating']);
        const courseProgressesPromise = CourseProgress.find({ _id: { $in: courseProgressIds } });

        const [courses, courseProgresses] = await Promise.all([
            coursePromise,
            courseProgressesPromise
        ]);

        let response = {};

        coursesReq.forEach((c, i) => {
            response[c._id] = {
                course: courses.find(co => co._id.toString() === c._id)
            };
            if (c.courseProgressId) {
                response[c._id]['courseProgress'] = courseProgresses.find(
                    cp => cp._id.toString() === c.courseProgressId
                );
            }
        });

        return res.json(response);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route		PUT api/course/:courseId/topic
 * @description Add a topic to course
 * @access		private + instructorOnly
 */
router.put(
    '/:courseId/topic',
    instructorAuth,
    [check('name', "Topic name can't be empty").not().isEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        try {
            const courseId = req.params.courseId;
            const position = req.body.position;

            const topicData = {
                name: req.body.name,
                course: courseId
            };
            const topic = new Topic(topicData);

            // Get course. We know course_id is valid because it is checked in the instructorAuth
            const coursePromise = Course.findOneAndUpdate(
                { _id: courseId },
                {
                    $push: {
                        topics: {
                            $each: [topic.id],
                            $position: position
                        }
                    },
                    modifiedDate: Date.now()
                }
            );

            // Save the topic
            const topicPromise = topic.save();

            await Promise.all([coursePromise, topicPromise]);

            res.json(topic);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        }
    }
);

/**
 * @route		GET api/course/:courseId
 * @description Get all course data with course ID
 * @access		public
 */
router.get('/:courseId', async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId)
            .lean()
            .populate('instructor', 'name')
            .populate({
                path: 'topics',
                select: 'name coreResources',
                populate: { path: 'coreResources', select: 'name' }
            });
        if (!course) {
            return res.status(400).json({ errors: [{ msg: 'Course not found' }] });
        }

        // check if a student has called this route
        const validToken = verifyToken(req);
        if (validToken) {
            const id = req.user.id;
            if (course.students.find(_id => _id.toString() === id)) {
                const courseProgress = await CourseProgress.find({ user: id, course: course._id });
                course['courseProgress'] = courseProgress;
            }
        }

        res.json(course);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ errors: [{ msg: 'Invalid Course Id' }] });
        }
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route		PUT api/course/:courseId/enroll
 * @description Enroll current user to courseId
 * @access		private
 */
router.put('/:courseId/enroll', auth, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        // get the course
        const course = await Course.findById(courseId);

        // Checking if course is there
        if (!course) {
            return res.status(400).json({ errors: [{ msg: 'Course not found' }] });
        }

        // instructor can't enroll !
        if (req.user.id === course.instructor.toString()) {
            return res.status(400).json({
                errors: [{ msg: "instructor can't enroll to a course " }]
            });
        }

        // check if student is not already enrolled
        if (course.students.filter(id => id.toString() === req.user.id).length > 0) {
            return res.status(400).json({ errors: [{ msg: 'Already Enrolled' }] });
        }

        // adding student to course
        course.students.push(req.user.id);

        // create courseProgress object to track progress
        const courseProgressData = {
            user: req.user.id,
            course: course.id
        };
        const courseProgress = new CourseProgress(courseProgressData);

        const coursePromise = course.save();
        const courseProgressPromise = courseProgress.save();

        // Add course to user enrolled courses
        const userPromise = User.findOneAndUpdate(
            { _id: req.user.id },
            {
                [`coursesEnrolled.${courseId}`]: courseProgress.id
            }
        );

        await Promise.all([coursePromise, courseProgressPromise, userPromise]);

        return res.json(courseProgress);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ errors: [{ msg: 'Invalid Course Id' }] });
        }
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route		PUT api/course/:courseId/lastStudied
 * @description Update lastStudied
 * @access		private + studentOnly
 */
router.put('/:courseId/lastStudied', studentAuth, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        let coursesEnrolled = await User.findById(req.user.id)
            .lean()
            .select('coursesEnrolled -_id');
        coursesEnrolled = coursesEnrolled['coursesEnrolled'];
        const courseProgressId = String(coursesEnrolled[courseId]);

        // update course progress
        await CourseProgress.findOneAndUpdate(
            { _id: courseProgressId },
            {
                $set: { lastStudied: Date.now() }
            }
        );
        res.json(courseProgressId);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route		PUT api/course/:courseId/review
 * @description Add/update review to course
 * @access		private + studentOnly
 */
router.put('/:courseId/review', studentAuth, async (req, res) => {
    try {
        const { text, rating } = req.body;
        const courseId = req.params.courseId;

        if (!Number.isInteger(rating) || rating <= 0 || !text) {
            return res.status(400).json({ errors: [{ msg: 'Bad Request' }] });
        }

        const course = await Course.findById(courseId);
        let totalRating = course.avgRating * course.reviews.length;

        const index = course.reviews.findIndex(review => String(review.user) === req.user.id);

        if (index === -1) {
            course.reviews.push({ user: req.user.id, text, rating });
        } else {
            totalRating -= course.reviews[index].rating;
            course.reviews[index] = { user: req.user.id, text, rating };
        }

        totalRating += rating;
        course.avgRating = totalRating / course.reviews.length;

        await course.save();
        res.json(course.reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route		POST api/course/:courseId/
 * @description Update course desc, tags,name, url
 * @access		private + instructorOnly
 */
router.post(
    '/:courseId',
    [
        instructorAuth,
        [
            oneOf([
                check('name').not().isEmpty(),
                check('description').not().isEmpty(),
                check('tags').not().isEmpty(),
                check('imageURL').not().isEmpty()
            ])
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'Please supply atleast one of: name, description, tags'
                    }
                ]
            });
        }
        const body = {};
        for (let key of ['name', 'description', 'tags', 'imageUrl']) {
            if (req.body[key]) body[key] = req.body[key];
        }

        try {
            const courseId = req.params.courseId;

            const newCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                {
                    ...body,
                    modifiedDate: Date.now()
                },
                { new: true }
            )
                .lean()
                .populate('instructor', 'name')
                .populate({
                    path: 'topics',
                    select: 'name coreResources',
                    populate: { path: 'coreResources', select: 'name' }
                });
            res.json(newCourse);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        }
    }
);

/**
 * @route		DELETE api/course/:courseId
 * @description Delete course
 * @access		private + instructorOnly
 */
router.delete('/:courseId', instructorAuth, async (req, res) => {
    try {
        const courseId = req.params.courseId;

        const course = await Course.findById(courseId);
        await course.remove();

        // Unenroll students
        const studentPromises = [];
        for (let studentId of course.students) {
            studentPromises.push(
                User.findOneAndUpdate(
                    { _id: studentId },
                    { $unset: { [`coursesEnrolled.${courseId}`]: '' } }
                ).select('coursesEnrolled')
            );
        }

        const students = await Promise.all(studentPromises);

        const courseProgressPromises = [];
        students.forEach(student => {
            const progressId = String(student.coursesEnrolled.get(courseId));
            courseProgressPromises.push(CourseProgress.findOneAndDelete({ _id: progressId }));
        });

        await Promise.all(courseProgressPromises);

        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route		DELETE api/course/:courseId/topic/:topicId
 * @description Delete topic from course
 * @access		private + instructorOnly
 */
router.delete('/:courseId/topic/:topicId', instructorAuth, async (req, res) => {
    try {
        const { courseId, topicId } = req.params;

        const topic = await Topic.findById(topicId);
        const topicPromise = topic.remove();

        const coursePromise = Course.findOneAndUpdate(
            { _id: courseId },
            { $pull: { topics: topicId } },
            { new: true }
        )
            .select('topics')
            .populate('topics', 'name');

        const [newCourse] = await Promise.all([coursePromise, topicPromise]);

        res.json(newCourse.topics);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ errors: [{ msg: 'Invalid data' }] });
        }
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

module.exports = router;
