const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');

// @route   GET api/profile
// @desc    Get user profile
// @access  Private
router.get('/', authMiddleware.verifyJWT, async (req, res) => {
    try {
        // In a real application, you would fetch the user's profile from the database
        // For now, we will just return some mock data
        const profile = {
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'Administrator'
        };
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;