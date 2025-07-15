require('dotenv').config();
const { verifyText } = require('../utils/llmClient');
const History = require('../models/History');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function handleCheck(req, res) {
    const { text } = req.body;
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.userId;
        } catch (err) {
            console.error('JWT verification error:', err);
        }
    }

    try {
        const result = await verifyText(text);

        // Save to history if logged in
        if (userId) {
            await History.create({
                user: userId,
                text,
                verdict: result.verdict,
                reasoning: result.reasoning
            });
        }

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error verifying text' });
    }
}

module.exports = { handleCheck };
