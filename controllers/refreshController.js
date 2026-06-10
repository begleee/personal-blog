const { Author } = require("../models");
const RefreshToken = require("../models/RefreshToken");
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'super_secret_refresh_key'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'different_secret_refresh_key';

exports.refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if(!refreshToken) {
            return res.status(401).json({ message: 'Refresh token required' });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        } catch (error) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        const savedToken = await RefreshToken.findOne({ where: { token: refreshToken } });
        if(!savedToken) {
            return res.status(403).json({ message: 'Refresh token has been revoked' });
        }

        if(new Date() > savedToken.expriresAt) {
            await savedToken.destroy();
            return res.status(403).json({ message: 'Refresh token expired. Please log in again' });
        }

        const author = await Author.findByPk(decoded.id);
        if(!author) return res.status(404).json({ message: 'User not found' });

        const newAccessToken = jwt.sign(
            { id: author.id, role: author.role },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        )

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
