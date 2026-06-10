const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const Author = sequelize.define('Author', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 100]
        }
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user' 
    }
}, {
    tableName: 'authors',
    timestamps: true,
    hooks: {
        beforeCreate: async (author) => {
            if(author.password) {
                const salt = await bcrypt.genSalt(10);
                author.password = await bcrypt.hash(author.password, salt);
            }
        },
        beforeUpdate: async (author) => {
            if(author.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                author.password = await bcrypt.hash(author.password, salt);
            }
        }
    }
})

Author.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = Author;
