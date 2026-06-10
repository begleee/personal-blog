const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Author = require('./Author');

const RefreshToken = sequelize.define('RefreshToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Author,
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'refresh_tokens',
    timestamps: true
})

module.exports = RefreshToken;
