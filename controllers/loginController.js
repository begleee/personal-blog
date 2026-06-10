const jwt = require('jsonwebtoken');
const Author = require('../models/Author');
const RefreshToken = require('../models/RefreshToken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'super_secret_access_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'different_secret_refresh_key';

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //find user by email
        const author = await Author.findOne({ where: { email }});

        if (!author || !(await author.validPassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const accessToken = jwt.sign(
            { id: author.id, role: author.role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshTokenJWT = jwt.sign(
            { id: author.id },
            REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        await RefreshToken.create({
            token: refreshTokenJWT,
            authorId: author.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })

        res.json({ 
            message: "Login successfully!",
            accessToken,
            refreshToken: refreshTokenJWT
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
