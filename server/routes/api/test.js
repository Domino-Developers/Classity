const express = require('express');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const getDateString = require('../../utils/getDateString');

// middlewares
const instructorAuth = require('../../middleware/instructorAuth');
const studentAuth = require('../../middleware/studentAuth');
const classroomAuth = require('../../middleware/classroomAuth');

// Models
const Test = require('../../models/Test');
const User = require('../../models/User').User;
const CourseProgress = require('../../models/CourseProgress');

// Initialize router
const router = express.Router();

// ----------------------------------- Routes ------------------------------------------

/**
 * @route		GET api/test/:testId
 * @description Get a test
 * @access		private + classroomOnly
 */
router.get('/:testId', classroomAuth, async (req, res) => {
    try {
        const test = await Test.findById(req.params.testId).lean().select('-_id');
        res.json(test);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route		PATCH api/test/:testId
 * @description Update a test
 * @access		private + instructorOnly
 */
router.patch(
    '/:testId',
    [instructorAuth, check('questions', "questions can't be empty").not().isEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                // Create test object to validate for errors
                const test = new Test({
                    ...req.body
                });

                // check for errors
                const ValidationErrors = test.validateSync();
                if (ValidationErrors) {
                    const errors = ValidationErrors.errors;
                    const errorMessages = [];
                    for (let field in errors) errorMessages.push({ msg: errors[field].message });

                    return res.status(400).json({ errors: errorMessages });
                }

                // save the test
                await Test.findOneAndUpdate(
                    { _id: req.params.testId },
                    {
                        ...req.body
                    },
                    { session }
                );

                res.json(test);
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        } finally {
            session.endSession();
        }
    }
);

/**
 * @route		PUT api/test/:testId
 * @description Add test score
 * @access		private + studentOnly
 */
router.put(
    '/:testId',
    [studentAuth, check('score', 'Score must be a number').not().isEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const courseObj = await Test.findById(req.params.testId).populate(
                    'topic',
                    'course'
                );
                const courseId = courseObj.topic.course;

                const progress = await CourseProgress.findOne({
                    user: req.user.id,
                    course: courseId
                });

                const initialScore = progress.testScores.get(`${req.params.testId}`)
                    ? progress.testScores.get(`${req.params.testId}`).score
                    : 0;

                progress.testScores.set(`${req.params.testId}`, {
                    score: initialScore + req.body.score,
                    lastAttemptDate: Date.now()
                });

                if (Math.floor((Date.now() - progress.lastStudied) / (24 * 3600 * 1000)) === 1) {
                    progress.streak += 1;
                } else if (
                    Math.floor((Date.now() - progress.lastStudied) / (24 * 3600 * 1000)) > 1 ||
                    progress.streak === 0
                ) {
                    progress.streak = 1;
                }

                progress.lastStudied = Date.now();

                const progressPromise = progress.save({ session });

                const userPromise = User.findOneAndUpdate(
                    { _id: req.user.id },
                    { $inc: { [`score.${getDateString()}`]: 2 * req.body.score } },
                    { session }
                );

                await Promise.all([progressPromise, userPromise]);

                res.json(progress);
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        } finally {
            session.endSession();
        }
    }
);

module.exports = router;
