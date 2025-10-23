const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactcontrol');

// POST /api/contact
router.post('/', contactController.sendContactMessage);

module.exports = router;
