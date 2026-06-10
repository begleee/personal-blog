const jwt = require('jsonwebtoken');
const Author = require('../models/Author');
const RefreshToken = require('../models/RefreshToken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'super_secret_access_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'different_secret_refresh_key';

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const author = await Author.create({
            username,
            email,
            password,
            role: 'user'
        });

        const accessToken = jwt.sign(
            { id: author.id, role: author.role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshTokenJWT = jwt.sign(
            { id: author.id },
            REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )

        await RefreshToken.create({
            authorId: author.id,
            token: refreshTokenJWT,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })

        res.status(201).json({ 
            message: 'Registered successfully',
            accessToken,
            refreshToken: refreshTokenJWT
        });
    } catch (error) {
        res.status(400).json({ 
            error: error.message
         });
    }
}