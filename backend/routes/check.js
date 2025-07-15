const express = require('express');
const router = express.Router();
const { verifyText } = require('../utils/llmClient');
const Check = require('../models/Check');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next();
    req.user = decoded;
    next();
  });
}

router.post('/', authenticate, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    const result = await verifyText(text);

    // Save to history only if logged in
    if (req.user) {
      await Check.create({
        userId: req.user.userId,
        text,
        verdict: result.verdict,
        reasoning: result.reasoning,
      });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Check failed' });
  }
});

module.exports = router;
