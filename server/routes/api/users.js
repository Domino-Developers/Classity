const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Models
const User = require('../../models/User');
const getToken = require('../../utils/tokenGenerator');
const emailSend = require('../../utils/emailSend');

// Init router
const router = express.Router();

/**
 * @route           POST api/users
 * @description     Register User
 * @access          Public
 */

// -----------------------------------------ROUTES --------------------------------------------------
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
        try {
            const { name, email, password } = req.body;
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }
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
                getToken(256)
            ]);
            user.verifyingToken = {
                for: 'email-verify',
                token: secretToken,
                expDate: Date.now() + 2 * 60 * 60 * 1000
            };
            await user.save();
            emailSend(
                email,
                'Please verify your email for Classity',
                `<h1>Please verify you email</h1><a href="http://localhost:3000/email-verify?_tk_=${secretToken}&_id_=${user.id}"> Click here to verify </a>`
            ).catch(err => console.error(err));
            return res.json({ success: true });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        }
    }
);

router.put('/email-verify', async (req, res) => {
    try {
        const { token, id } = req.body;
        if (!token || !id) {
            return res.status(400).json({ errors: [{ msg: 'Bad request' }] });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Bad request' }] });
        }

        if (!user.verifyingToken || user.verifyingToken.for !== 'email-verify') {
            return res.status(403).json({ errors: [{ msg: 'Not allowed' }] });
        }

        const [token_, expDate_] = [user.verifyingToken.token, user.verifyingToken.expDate];

        if (expDate_ <= Date.now()) {
            return res.status(400).json({ errors: [{ msg: 'Token expired' }] });
        }

        if (token !== token_) {
            return res.status(403).json({ errors: [{ msg: 'Not allowed' }] });
        }

        user.verifyingToken = null;
        await user.save();

        return res.json({ msg: 'Email verification Success !' });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ errors: [{ msg: 'Bad request' }] });
        }
        return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

module.exports = router;
