const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate, authorizePostAccess, authorizeAuthorAccess } = require('../middlewares/auth');

router.get('/', postController.getAllPosts);
router.post('/', authenticate, postController.createPost);

module.exports = router;
