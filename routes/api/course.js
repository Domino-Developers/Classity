const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// middlewares
const auth = require('../../middleware/auth');

// Models
const Course = require('../../models/Course');

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
            res.status(400).json({ errors: errors.array() });
        }

        try {
            const courseData = {
                ...req.body,
                instructor: req.user.id
            };
            const course = new Course(courseData);
            await course.save();
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
 * @access		private
 */

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('instructor', ['name'])
            .select(['name', 'instructor', 'tags', 'avgRating']);
        res.json(courses);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
