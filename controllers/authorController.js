const { Post, Author } = require('../models');

exports.getAllAuthors = async (req, res) => {
    const authors = await Author.findAll();
    res.json(authors);
};

exports.getAuthor = async (req, res) => {
    const author = await Author.findOne({ where: { id: req.user.id }});
    res.json(author);
}

exports.createAuthor = async (req, res) => {
    const author = await Author.create(req.body);
    res.status(201).json(author);
}
