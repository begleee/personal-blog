const sequelize = require('../config/database');
const Author = require('./Author');
const Post = require('./Post');
const RefreshToken = require('./RefreshToken');

Author.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });

Author.hasMany(RefreshToken, { foreignKey: 'authorId', onDelete: 'CASCADE' });
RefreshToken.belongsTo(Author, { foreignKey: 'authorId' });

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
