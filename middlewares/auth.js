const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'super_secret_access_key';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.body.authorId = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Foribidden: Invalid token' });
    }
}

const authorizePostAccess = async (req, res, next) => {
    try {
        if(req.user.role === 'admin') return next();

        const postId = req.params.id;
        const post = await Post.findByPk(postId);

        if(!post) return res.status(404).json({ message: 'Post not found' });

        if(post.authorId !== req.user.id) {
            return res.status(403).json( {message: 'Access denied: You do not own this post'} );
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const authorizeAuthorAccess = async (req, res, next) => {
    if(req.user.role === 'admin') return next();

    const targetAuthorId = parseInt(req.params.id);

    if(targetAuthorId !== req.user.id) {
        return res.status(403).json({ messaage: 'Access denied: You can only manage your own accaount' });
    }

    next();
};

module.exports = { authenticate, authorizePostAccess, authorizeAuthorAccess };
