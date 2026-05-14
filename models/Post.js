const { DataTypes } = require('sequelize');
const sequelize = require('../config/database')

const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    details: {
        type: DataTypes.STRING,
        allowNull: false
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'authors',
            key: 'id'
        }
    }
}, {
    tableName: 'posts',
    timestamps: true
})

module.exports = Post;
