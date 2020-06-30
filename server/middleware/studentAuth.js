const { verify, isStudent } = require('./util');

/**
 * @param {*} req request
 * @param {*} res result
 * @param {*} next
 * @description middleware to check if the student is enrolled in course or not
 */
const studentAuth = async (req, res, next) => {
    try {
        verify(req);

        if (!(await isStudent(req))) {
            return res.status(401).json({ errors: [{ msg: 'Not a student' }] });
        }

        next();
    } catch (err) {
        if (err.kind === 'BadRequest') {
            return res.status(400).json({ errors: [{ msg: err.message }] });
        }

        if (err.kind === 'NotAuthorized') {
            return res.status(401).json({ errors: [{ msg: err.message }] });
        }

        console.error(err.message);
        return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
};

module.exports = studentAuth;
