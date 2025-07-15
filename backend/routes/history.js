const express = require('express');
const router = express.Router();
const Check = require('../models/Check');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });

    try {
      const history = await Check.find({ userId: decoded.userId }).sort({ createdAt: -1 });
      res.json({ history });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch history' });
    }
  });
});

module.exports = router;
