const { isInstructor } = require('./util');

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description middleware to check if the user is instructor of course
 */
const instructorAuth = async (req, res, next) => {
    try {
        if (!(await isInstructor(req))) {
            return res
                .status(401)
                .json({ msg: 'Not authorized to edit course' });
        }

        next();
    } catch (err) {
        if (err.kind === 'BadRequest') {
            return res.status(400).json({ msg: err.message });
        }

        console.error(err.message);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

module.exports = instructorAuth;
