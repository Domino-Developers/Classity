const express = require('express');

const emailSend = require('../../utils/emailSend');

// Init router
const router = express.Router();

// -----------------------------------------ROUTES --------------------------------------------------

/**
 * @route           POST api/feedback
 * @description     Send feedback
 * @access          Public
 */
router.post('/feedback', async (req, res) => {
    try {
        const { email, ui, score, contribution, suggestions } = req.body;

        if (email)
            await emailSend(
                email,
                'Classity Feedback',
                null,
                `Hi,\nThanks for giving feedback to Classity.\nYour query/suggestion has been received, sorry for any inconvenience caused.\nWe take our customer's suggestion/criticism very seriously and will reply to you soon.\n\nClassity\n(Domino Developers)`
            );

        await emailSend(
            'sanchit.arora.2002@gmail.com',
            'Classity Feedback',
            null,
            `Email: ${email}\nUI: ${ui}\nScore: ${score}\nContribution: ${contribution}\nSuggestions: ${suggestions}`
        );

        await emailSend(
            'gurkirat.singh@students.iiit.ac.in',
            'Classity Feedback',
            null,
            `Email: ${email}\nUI: ${ui}\nScore: ${score}\nContribution: ${contribution}\nSuggestions: ${suggestions}`
        );

        return res.json({ success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

module.exports = router;
