const express = require('express');
const passport = require('passport');

const router = express.Router();

const clientURL =
    process.env[`CLIENT_URL_${process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'}`];

router.get('/', passport.authenticate('google'));

router.get('/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            const msg = info ? info.message : 'Please try again';
            return res.redirect(`${clientURL}/glogin?err=${msg}`);
        }
        return res.redirect(`${clientURL}/glogin?_gtk_=${user.generateJWT()}`);
    })(req, res, next);
});

module.exports = router;
