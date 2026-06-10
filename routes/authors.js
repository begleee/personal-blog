const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const { authenticate, authorizePostAccess, authorizeAuthorAccess } = require('../middlewares/auth');

router.get('/', authorController.getAllAuthors);

module.exports = router;
