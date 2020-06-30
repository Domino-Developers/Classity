const { verify, isInstructor } = require('./util');

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description middleware to check if the user is instructor of course
 */
const instructorAuth = async (req, res, next) => {
    try {
        verify(req);

        if (!(await isInstructor(req))) {
            return res
                .status(401)
                .json({ errors: [{ msg: 'Not authorized to edit course' }] });
        }

        next();
    } catch (err) {
        if (err.kind === 'BadRequest') {
            return res.status(400).json({ errors: [{ msg: err.message }] });
        }

        if (err.kind === 'NotAuthorized') {
            return res.status(401).json({ errors: [{ msg: err.message }] });
        }
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ errors: [{ msg: 'Invalid data' }] });
        }

        console.error(err.message);
        return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
};

module.exports = instructorAuth;
