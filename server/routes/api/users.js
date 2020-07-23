const express = require('express');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const auth = require('../../middleware/auth');

// Models
const User = require('../../models/User');
const getToken = require('../../utils/tokenGenerator');
const emailSend = require('../../utils/emailSend');
const { verifyEmailHTML } = require('../../utils/getHtmlBody');

// Init router
const router = express.Router();

// -----------------------------------------ROUTES --------------------------------------------------

/**
 * @route           POST api/users
 * @description     Register User
 * @access          Public
 */
router.post(
    '/',
    [
        check('name', 'Please enter name').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Password should be atleast 6 charachters long').isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        const session = await mongoose.startSession();

        try {
            session.withTransaction(async () => {
                const { name, email, password } = req.body;
                let user = await User.findOne({ email });
                if (user) return res.status(400).json({ errors: [{ msg: 'User already exists' }] });

                const avatar = gravatar.url(email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                user = new User({
                    name,
                    email,
                    password,
                    avatar
                });
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                let secretToken;
                [user.password, secretToken] = await Promise.all([
                    bcrypt.hash(password, salt),
                    getToken(100)
                ]);
                user.verifyingToken = {
                    for: 'email-verify',
                    token: secretToken,
                    expDate: Date.now() + 2 * 60 * 60 * 1000
                };

                await user.save({ session });
                emailSend(
                    email,
                    'Verify your email',
                    verifyEmailHTML(
                        name,
                        `http://localhost:3000/email-verify?_tk_=${secretToken}&_id_=${user.id}`
                    )
                ).catch(err => console.error(err));

                res.json({ success: true });
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
 * @route           PUT api/users/email-verify
 * @description     Verify email
 * @access          Public
 */
router.put('/email-verify', async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.withTransaction(async () => {
            const { token, id } = req.body;
            if (!token || !id)
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Verification failed! Please try again' }] });

            const user = await User.findById(id);

            if (!user)
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Verification failed! Please try again' }] });

            if (!user.verifyingToken || user.verifyingToken.for !== 'email-verify')
                return res
                    .status(403)
                    .json({ errors: [{ msg: 'Verification failed! Please try again' }] });

            const [token_, expDate_] = [user.verifyingToken.token, user.verifyingToken.expDate];

            if (expDate_ <= Date.now())
                return res.status(400).json({
                    errors: [{ msg: 'Link expired! Please rerequest verification email' }]
                });

            if (token !== token_)
                return res
                    .status(403)
                    .json({ errors: [{ msg: 'Verification failed! Please try again' }] });

            user.verifyingToken = null;
            await user.save({ session });

            res.json({ msg: 'Email verification Success !' });
        });
    } catch (err) {
        if (err.kind === 'ObjectId')
            return res
                .status(400)
                .json({ errors: [{ msg: 'Verification failed! Please try again' }] });

        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    } finally {
        session.endSession();
    }
});

/**
 * @route           GET api/users
 * @description     Get all users name, email, score and contributions
 * @access          Private
 */
router.get('/', auth, async (req, res) => {
    try {
        const { sort, limit, skip } = JSON.parse(req.query.source || '{}');

        const users = await User.aggregate([
            {
                $project: {
                    score: {
                        $reduce: {
                            input: { $objectToArray: '$score' },
                            initialValue: 0,
                            in: { $add: ['$$value', '$$this.v'] }
                        }
                    },
                    contribution: {
                        $reduce: {
                            input: { $objectToArray: '$contribution' },
                            initialValue: 0,
                            in: { $add: ['$$value', '$$this.v'] }
                        }
                    },
                    name: '$name',
                    email: '$email'
                }
            },
            { $sort: sort || { _id: 1 } },
            { $skip: skip || 0 },
            { $limit: limit || 10 }
        ]);

        return res.json(users);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route           GET api/users/:userId
 * @description     Get user name, email, score and contributions by user Id
 * @access          Private
 */
router.get('/:userId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('name email score contribution');

        return res.json(user);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ errors: [{ msg: 'Invalid User Id' }] });
        }
        console.log(err.message);
        return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

module.exports = router;
