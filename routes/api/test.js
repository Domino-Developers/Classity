const express = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// middlewares
const auth = require('../../middleware/auth');
const instructorAuth = require('../../middleware/instructorAuth');
const studentAuth = require('../../middleware/studentAuth');
const classroomAuth = require('../../middleware/classroomAuth');

// Models
const User = require('../../models/User');
const Topic = require('../../models/Topic');
const Comment = require('../../models/Comment');
const Test = require('../../models/Test');

// Initialize router
const router = express.Router();

// ----------------------------------- Routes ------------------------------------------

/**
 * @route		GET api/test/:testId
 * @description Get a test
 * @access		private + classroomOnly
 */
router.get('/:testId', [auth, classroomAuth], async (req, res) => {
    try {
        const test = await Test.findById(req.params.testId)
            .lean()
            .select('-_id');
        res.json(test);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

/**
 * @route		GET api/test/:testId
 * @description Get a test
 * @access		private + classroomOnly
 */
router.get('/:testId', [auth, classroomAuth], async (req, res) => {
    try {
        const test = await Test.findById(req.params.testId)
            .lean()
            .select('-_id');
        res.json(test);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});
module.exports = router;
