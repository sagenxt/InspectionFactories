const express = require('express');
const router = express.Router();
const SectionController = require('../controllers/SectionController');

// GET /sections?formType=A
router.get('/', SectionController.getSectionsByFormType);

module.exports = router;
