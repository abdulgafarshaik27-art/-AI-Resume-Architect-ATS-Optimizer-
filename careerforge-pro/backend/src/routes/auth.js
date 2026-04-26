const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

// In-memory store (replace with DB in production)
// Structure: { [email]: { id, email, passwordHash, plan: 'free'|'pro', resumeCount, stripeCustomerId } }
const users = {};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (users[email]) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    users[email] = {
      id: userId,
      email,
      name,
      passwordHash,
      plan: 'free',
      resumeCount: 0,
      stripeCustomerId: null,
      createdAt: new Date().toISOString(),
    };

    const token = jwt.sign(
      { id: userId, email, name, plan: 'free' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: userId, email, name, plan: 'free', resumeCount: 0 },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users[email];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, plan: user.plan },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        resumeCount: user.resumeCount,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me — get current user info
router.get('/me', require('../middleware/auth'), (req, res) => {
  const user = users[req.user.email];
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    resumeCount: user.resumeCount,
  });
});

// Expose users map for webhook updates (in production use a real DB)
module.exports = router;
module.exports.users = users;
