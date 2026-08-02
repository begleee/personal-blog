const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'super_secret_access_key';

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer '))
            return res.status(401).json({ message: "Unauthorized" });
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        if(error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'TokenExpiredError',
                message: 'Access token has expired',
                code: 'TOKEN_EXPIRED'
            });
        }

        return res.status(403).json({ message: error.name });
    }
}

const authorizePostAccess = async (req, res, next) => {
    try {
        if(req.user.role === 'admin') return next();

        const postId = req.params.id;
        const post = await Post.findByPk(postId);

        if(!post) return res.status(404).json({ message: 'Post not found' });

        if(post.authorId !== req.user.id)
            return res.status(403).json( {message: 'Access denied: You do not own this post'} );

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const authorizeAuthorAccess = async (req, res, next) => {
    try {
        if(req.user.role === 'admin') return next();
        return res.status(404).send(`<!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="utf-8">
                <title>Error</title>
            </head>

            <body>
                <pre>Cannot GET ${req.route.path}</pre>
            </body>

        </html>`);
    } catch (error) {
        return res.status(403).json({ message: error.name });
    }
};

const authorizeUserAccess = async (req, res, next) => {
    try {
        if(req.user.id === req.params.id) next();
    } catch (error) {
        return res.status(403).json({ message: error.name });
    }
}

module.exports = { authenticate, authorizePostAccess, authorizeAuthorAccess, authorizeUserAccess };
