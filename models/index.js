const sequelize = require('../config/database');
const Author = require('./Author');
const Post = require('./Post');

Author.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected");
        await sequelize.sync({ alter: true });
        console.log("Models synced");
    } catch (error) {
        console.error("Database error: ", error);
        process.exit(1);
    }
}

module.exports = { sequelize, Author, Post, syncDatabase };
