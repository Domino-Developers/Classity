const express = require('express');
const { check, validationResult } = require('express-validator');

// middlewares
const auth = require('../../middleware/auth');
const instructorAuth = require('../../middleware/instructorAuth');

// Models
const Course = require('../../models/Course');
const User = require('../../models/User');
const Topic = require('../../models/Topic');
const CourseProgress = require('../../models/CourseProgress');

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
            check('description', "Description can't be empty").not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const courseData = {
                ...req.body,
                instructor: req.user.id
            };
            const course = new Course(courseData);
            await course.save();
            await User.findOneAndUpdate(
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

            res.json(course);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: 'Server Error' });
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
        res.status(500).json({ msg: 'Server Error' });
    }
});

/**
 * @route		PUT api/course/:courseId/topic
 * @description Add a topic to course
 * @access		private + instructorOnly
 */

router.put(
    '/:courseId/topic',
    auth,
    instructorAuth,
    [check('name', "Topic name can't be empty").not().isEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
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
            await Course.findOneAndUpdate(
                { _id: courseId },
                {
                    $push: {
                        topics: {
                            $each: [topic.id],
                            $position: position
                        }
                    }
                }
            );

            // Save the topic
            await topic.save();
            res.json(topic);
        } catch (err) {
            if (err.kind === 'ObjectId') {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'incorrect course_id' }] });
            }
            console.log(err.message);
            res.status(500).json({ msg: 'Server Error' });
        }
    }
);

/**
 * @route		GET api/course/:course_id
 * @description Get all course data with course ID
 * @access		public
 */

router.get('/:course_id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.course_id)
            .populate('instructor', 'name -_id')
            .populate('topics', 'name -_id')
            .select('-students');
        if (!course) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'course_id not found' }] });
        }
        res.json(course);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res
                .status(400)
                .json({ errors: [{ msg: 'incorrect course_id' }] });
        }
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

/**
 * @route		PUT api/course/:course_id/enroll
 * @description Enroll current user to course_id
 * @access		private
 */
router.put('/:course_id/enroll', auth, async (req, res) => {
    try {
        // get the course
        const course = await Course.findById(req.params.course_id);

        // Checking if course is there
        if (!course) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'course_id not found' }] });
        }

        // instructor can't enroll !
        if (req.user.id === course.instructor.toString()) {
            return res.status(400).json({
                errors: [{ msg: "instructor can't enroll to a course " }]
            });
        }

        // check if student is not already enrolled
        if (
            course.students.filter(id => id.toString() === req.user.id).length >
            0
        ) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Already Enrolled' }] });
        }

        // adding student to course
        course.students.push(req.user.id);

        // create courseProgress object to track progress
        const courseProgressData = {
            user: req.user.id,
            course: course.id
        };
        const courseProgress = new CourseProgress(courseProgressData);

        await course.save();
        await courseProgress.save();
        // Add course to user enrolled courses
        await User.findOneAndUpdate(
            { _id: req.user.id },
            {
                $push: {
                    coursesEnrolled: {
                        $each: [
                            {
                                courseId: course.id,
                                courseProgressId: courseProgress.id
                            }
                        ],
                        $position: 0
                    }
                }
            }
        );

        return res.json(courseProgress);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res
                .status(400)
                .json({ errors: [{ msg: 'incorrect course_id' }] });
        }
        console.error(err.message);
        res.status(500).json({ msg: 'ServerError' });
    }
});

module.exports = router;
