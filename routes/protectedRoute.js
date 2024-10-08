const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Faça login para acessar.' });
});

module.exports = router;
