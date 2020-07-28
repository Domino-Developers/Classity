const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { GoogleUser, User } = require('../models/User');

module.exports = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `/auth/google/callback`,
        scope: ['email', 'profile'],
        proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const oldUser = await User.findOne({ email: profile._json.email });
            if (oldUser) {
                if (oldUser.provider === 'google') done(null, oldUser);
                else {
                    done(null, false, {
                        message: 'Account already exists with email and password'
                    });
                }
            } else {
                const userData = {
                    name: profile._json.name,
                    email: profile._json.email,
                    avatar: profile._json.picture,
                    googleId: profile.id
                };
                const newUser = new GoogleUser(userData);
                await newUser.save();
                done(null, newUser);
            }
        } catch (err) {
            done(err);
        }
    }
);
