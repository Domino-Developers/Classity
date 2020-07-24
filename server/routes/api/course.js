const express = require('express');
const mongoose = require('mongoose');
const { check, oneOf, validationResult } = require('express-validator');

const getDateString = require('../../utils/getDateString');

// middlewares
const auth = require('../../middleware/auth');
const instructorAuth = require('../../middleware/instructorAuth');
const studentAuth = require('../../middleware/studentAuth');

// Models
const Course = require('../../models/Course');
const User = require('../../models/User');
const Topic = require('../../models/Topic');
const CourseProgress = require('../../models/CourseProgress');
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

        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const courseData = {
                    ...req.body,
                    instructor: req.user.id
                };
                const course = new Course(courseData);
                const coursePromise = course.save({ session });
                const userPromise = User.findOneAndUpdate(
                    { _id: req.user.id },
                    {
                        $push: {
                            coursesCreated: {
                                $each: [course.id],
                                $position: 0
                            }
                        }
                    },
                    { session }
                );

                await Promise.all([coursePromise, userPromise]);

                res.json(course);
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
 * @route		GET api/course
 * @description Get course names, instructor, tags, avgRating
 * @access		public
 */
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('instructor', 'name -_id')
            .select(['name', 'instructor', 'tags', 'avgRating', 'imageURL']);
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
            .select(['name', 'instructor', 'tags', 'avgRating', 'imageURL'])
            .populate({
                path: 'topics',
                select: 'coreResources deadline',
                populate: { path: 'coreResources', select: 'name' }
            })
            .lean();
        const courseProgressesPromise = CourseProgress.find({ _id: { $in: courseProgressIds } });

        const [courses, courseProgresses] = await Promise.all([
            coursePromise,
            courseProgressesPromise
        ]);

        let response = {};

        coursesReq.forEach((c, i) => {
            const courseData = courses.find(co => co._id.toString() === c._id);
            const topics = courseData.topics;
            delete courseData.topics;
            response[c._id] = {
                course: {
                    ...courseData,
                    totalCoreResources: topics.reduce(
                        (tot, top) => tot + top.coreResources.length,
                        0
                    )
                }
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
 * @route		GET api/course/search
 * @description Search for courses by name
 * @access		public
 */
router.get('/search', async (req, res) => {
    if (!req.query.source) return res.status(400).json({ errors: [{ msg: 'Bad request' }] });

    const { source } = req.query;
    const { text } = JSON.parse(source);
    const regex = new RegExp(text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'gi');

    try {
        const result = await Course.find({ name: regex });

        return res.json(result);
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

        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
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
                        }
                    },
                    { session }
                );

                // Save the topic
                const topicPromise = topic.save({ session });

                await Promise.all([coursePromise, topicPromise]);

                res.json(topic);
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
 * @route		GET api/course/:courseId
 * @description Get all course data with course ID
 * @access		public
 */
router.get('/:courseId', async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId)
            .lean()
            .populate('instructor', 'name')
            .populate('reviews.user', 'name')
            .populate({
                path: 'topics',
                select: 'name coreResources deadline',
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
                const courseProgress = await CourseProgress.findOne({
                    user: id,
                    course: course._id
                });
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
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const courseId = req.params.courseId;
            // get the course
            const course = await Course.findById(courseId);

            // Checking if course is there
            if (!course) return res.status(400).json({ errors: [{ msg: 'Course not found' }] });

            // instructor can't enroll !
            if (req.user.id === course.instructor.toString())
                return res.status(400).json({
                    errors: [{ msg: "instructor can't enroll to a course " }]
                });

            // check if student is not already enrolled
            if (course.students.filter(id => id.toString() === req.user.id).length > 0)
                return res.status(400).json({ errors: [{ msg: 'Already Enrolled' }] });

            // check if the student has energy
            const user = await User.findById(req.user.id);
            if (user.energy <= 0)
                return res.status(403).json({ errors: [{ msg: 'Not enough energy' }] });

            // adding student to course
            course.students.push(req.user.id);

            // create courseProgress object to track progress
            const courseProgressData = {
                user: req.user.id,
                course: course.id
            };
            const courseProgress = new CourseProgress(courseProgressData);

            const coursePromise = course.save({ session });
            const courseProgressPromise = courseProgress.save({ session });

            // Add course to user enrolled courses
            user.energy -= 1;
            user.coursesEnrolled.set(courseId, courseProgress.id);
            const userPromise = user.save({ session });

            await Promise.all([coursePromise, courseProgressPromise, userPromise]);

            res.json(courseProgress);
        });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            res.status(400).json({ errors: [{ msg: 'Invalid Course Id' }] });
        } else {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        }
    } finally {
        session.endSession();
    }
});

/**
 * @route		PUT api/course/:courseId/lastStudied
 * @description Update lastStudied
 * @access		private + studentOnly
 */
router.put('/:courseId/lastStudied', studentAuth, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
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
                },
                { session }
            );

            res.json(courseProgressId);
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    } finally {
        session.endSession();
    }
});

/**
 * @route		PUT api/course/:courseId/resetDeadline
 * @description Reset Deadline
 * @access		private + studentOnly
 */
router.put('/:courseId/resetDeadline', studentAuth, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
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
                    $set: { startedOn: Date.now() }
                },
                { session }
            );

            res.json(courseProgressId);
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    } finally {
        session.endSession();
    }
});

/**
 * @route		PUT api/course/:courseId/review
 * @description Add/update review to course
 * @access		private + studentOnly
 */
router.put('/:courseId/review', studentAuth, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        await await session.withTransaction(async () => {
            const { text, rating } = req.body;
            const courseId = req.params.courseId;

            if (!Number.isInteger(rating) || rating <= 0 || rating > 5 || !text) {
                await session.abortTransaction();
                session.endSession();

                return res.status(400).json({ errors: [{ msg: 'Bad Request' }] });
            }

            const course = await Course.findById(courseId).populate('topics', 'coreResources');

            let totalRating = course.avgRating * course.reviews.length;

            const index = course.reviews.findIndex(review => String(review.user) === req.user.id);

            const contributionByRating = [-100, -5, 0, 5, 10, 20];
            let contribution = contributionByRating[rating];

            if (index === -1) {
                course.reviews.push({ user: req.user.id, text, rating });
            } else {
                contribution -= contributionByRating[course.reviews[index].rating];
                totalRating -= course.reviews[index].rating;
                course.reviews[index] = { user: req.user.id, text, rating };
            }

            totalRating += rating;
            course.avgRating = totalRating / course.reviews.length;

            course.points += contribution;
            if (course.points >= course.threshold) {
                course.threshold *= 2;

                let totalResources = 0;
                course.topics.forEach(topic => (totalResources += topic.coreResources.length));
                contribution += 50 * totalResources;
            }

            const coursePromise = course.save({ session });
            const userPromise = User.findOneAndUpdate(
                { _id: course.instructor },
                { $inc: { [`contribution.${getDateString()}`]: contribution } },
                { session }
            );

            await Promise.all([coursePromise, userPromise]);

            res.json(course.reviews);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    } finally {
        session.endSession();
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
        for (let key of ['name', 'description', 'tags', 'imageURL']) {
            if (req.body[key]) body[key] = req.body[key];
        }

        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const courseId = req.params.courseId;

                const newCourse = await Course.findOneAndUpdate(
                    { _id: courseId },
                    {
                        ...body,
                        modifiedDate: Date.now()
                    },
                    { new: true, session }
                )
                    .lean()
                    .populate('instructor', 'name')
                    .populate({
                        path: 'topics',
                        select: 'name coreResources',
                        populate: { path: 'coreResources', select: 'name' }
                    });

                res.json(newCourse);
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
 * @route		DELETE api/course/:courseId
 * @description Delete course
 * @access		private + instructorOnly
 */
router.delete('/:courseId', instructorAuth, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const courseId = req.params.courseId;

            const course = await Course.findById(courseId).session(session);

            const coursePromise = course.remove();

            // Remove from created courses
            const instructorPromise = User.findOneAndUpdate(
                { _id: req.user.id },
                { $pull: { coursesCreated: courseId } },
                { session }
            );

            // Unenroll students
            const studentPromises = [];
            for (let studentId of course.students) {
                studentPromises.push(
                    User.findOneAndUpdate(
                        { _id: studentId },
                        { $unset: { [`coursesEnrolled.${courseId}`]: '' } },
                        { session }
                    ).select('coursesEnrolled')
                );
            }

            const students = await Promise.all(studentPromises);

            const courseProgressPromises = [];
            students.forEach(student => {
                const progressId = String(student.coursesEnrolled.get(courseId));
                courseProgressPromises.push(
                    CourseProgress.findOneAndDelete({ _id: progressId }, { session })
                );
            });

            await Promise.all([...courseProgressPromises, coursePromise, instructorPromise]);

            res.json(course);
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    } finally {
        session.endSession();
    }
});

/**
 * @route		DELETE api/course/:courseId/topic/:topicId
 * @description Delete topic from course
 * @access		private + instructorOnly
 */
router.delete('/:courseId/topic/:topicId', instructorAuth, async (req, res) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const { courseId, topicId } = req.params;

            const topic = await Topic.findById(topicId).session(session);
            const topicPromise = topic.remove();

            const coursePromise = Course.findOneAndUpdate(
                { _id: courseId },
                { $pull: { topics: topicId } },
                { new: true, session }
            )
                .select('topics')
                .populate('topics', 'name');

            const [newCourse] = await Promise.all([coursePromise, topicPromise]);

            res.json(newCourse.topics);
        });
    } catch (err) {
        if (err.kind === 'ObjectId')
            return res.status(400).json({ errors: [{ msg: 'Invalid data' }] });

        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    } finally {
        session.endSession();
    }
});

module.exports = router;
