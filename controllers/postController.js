const { Post, Author } = require('../models');

exports.getAllPosts = async (req, res) => {
    const posts = await Post.findAll({ include: [{ model: Author, as: 'author' }] });
    res.json(posts);
};

exports.createPost = async (req, res) => {
    const post = await Post.create(req.body);
    res.status(201).json(post);
}
