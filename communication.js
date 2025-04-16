
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const postmark = require('postmark');
const Communication = require('../models/Communication');
const router = express.Router();

const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

// Google OAuth Routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`http://localhost:3000/dashboard?token=${req.user.token}`);
  }
);

// Middleware for JWT auth
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Unauthorized');
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token');
    req.user = decoded;
    next();
  });
};

// Get Communication History
router.get('/communications', authMiddleware, async (req, res) => {
  const history = await Communication.find({ userId: req.user.id });
  res.json(history);
});

// Send Email
router.post('/send', authMiddleware, async (req, res) => {
  const { to, subject, body, type } = req.body;
  try {
    const result = await client.sendEmail({
      From: process.env.FROM_EMAIL,
      To: to,
      Subject: subject,
      HtmlBody: body
    });
    await Communication.create({
      userId: req.user.id,
      to, subject, body, type, status: 'Sent'
    });
    res.json({ message: 'Email sent', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
