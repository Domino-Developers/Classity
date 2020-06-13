const express = require('express');
const { check, validationResult } = require('express-validator');

// middlewares
const auth = require('../../middleware/auth');
const instructorAuth = require('../../middleware/instructorAuth');

// Models
const Course = require('../../models/Course');
const User = require('../../models/User');
const Topic = require('../../models/Topic');

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
                courseId
            };
            const topic = new Topic(topicData);
            await topic.save();
            await Course.findOneAndUpdate(
                { _id: courseId },
                {
                    $push: {
                        topics: { $each: [topic.id], $position: position }
                    }
                }
            );
            res.json(topic);
        } catch (err) {
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
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});
module.exports = router;
