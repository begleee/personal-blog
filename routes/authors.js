const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const { authenticate, authorizePostAccess, authorizeAuthorAccess, authorizeUserAccess } = require('../middlewares/auth');

router.get('/', authenticate, authorizeAuthorAccess, authorController.getAllAuthors);
router.get('/me', authenticate, authorController.getAuthor);
router.post('/', authorController.createAuthor);

module.exports = router;
