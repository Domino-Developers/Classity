const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../../middleware/auth');

// Models
const User = require('../../models/User');

// Initialize router
const router = express.Router();

//--------------------------------------ROUTES ------------------------------------------------------------------------------

/**
 * @route		POST api/auth
 * @description Login user to get the token
 * @access		public
 */
router.post(
    '/',
    [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Password required').exists()
    ],
    async (req, res) => {
        // check for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }
        try {
            // get email password
            const { email, password } = req.body;

            // get user from db
            let user = await User.findOne({ email });

            // if there is no user
            if (!user) {
                return res.status(401).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            if (user.verifyingToken && user.verifyingToken.for === 'email-verify') {
                return res.json({ inactive: true });
            }

            // check the password
            const isMatch = await bcrypt.compare(password, user.password);

            // if password doesnt match
            if (!isMatch) {
                return res.status(401).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            // Send back token if credentials are correct
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                process.env.SECRET_KEY,
                {
                    expiresIn: 36000000
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        }
    }
);

/**
 * @route           GET api/auth
 * @description     get user credentials with token
 * @access          private
 */
router.get('/', auth, async (req, res) => {
    try {
        //get user form db
        const user = await User.findById(req.user.id).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

module.exports = router;
