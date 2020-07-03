const { verify, isStudent, isInstructor } = require('./util');

/**
 * @param {*} req request
 * @param {*} res result
 * @param {*} next
 * @description middleware to check if the user is either a student or instructor
 */
const classroomAuth = async (req, res, next) => {
    try {
        verify(req);

        if (!(await isStudent(req)) && !(await isInstructor(req))) {
            return res
                .status(401)
                .json({ errors: [{ msg: 'Not authorized' }] });
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

module.exports = classroomAuth;
