const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const { users } = require('./auth');

const router = express.Router();

// In-memory resume store: { [userId]: Resume[] }
const resumeStore = {};

// Helper: get user's resumes array
function getUserResumes(userId) {
  if (!resumeStore[userId]) resumeStore[userId] = [];
  return resumeStore[userId];
}

// GET /api/resume — list all resumes for user
router.get('/', authMiddleware, (req, res) => {
  const resumes = getUserResumes(req.user.id);
  res.json(resumes.map(r => ({
    id: r.id,
    title: r.title,
    updatedAt: r.updatedAt,
    atsScore: r.atsScore || 0,
  })));
});

// POST /api/resume — create new resume
router.post('/', authMiddleware, (req, res) => {
  const user = users[req.user.email];
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Free plan: max 1 resume
  if (user.plan === 'free' && user.resumeCount >= 1) {
    return res.status(403).json({
      error: 'Free plan limit reached. Upgrade to Pro for unlimited resumes.',
      upgrade: true,
    });
  }

  const resume = {
    id: uuidv4(),
    userId: req.user.id,
    title: req.body.title || 'My Resume',
    data: req.body.data || getEmptyResumeData(),
    atsScore: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  getUserResumes(req.user.id).push(resume);
  user.resumeCount = (user.resumeCount || 0) + 1;

  res.status(201).json(resume);
});

// GET /api/resume/:id — get single resume
router.get('/:id', authMiddleware, (req, res) => {
  const resumes = getUserResumes(req.user.id);
  const resume = resumes.find(r => r.id === req.params.id);
  if (!resume) return res.status(404).json({ error: 'Resume not found' });
  res.json(resume);
});

// PUT /api/resume/:id — update resume
router.put('/:id', authMiddleware, (req, res) => {
  const resumes = getUserResumes(req.user.id);
  const idx = resumes.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Resume not found' });

  resumes[idx] = {
    ...resumes[idx],
    ...req.body,
    id: resumes[idx].id,
    userId: req.user.id,
    updatedAt: new Date().toISOString(),
  };

  res.json(resumes[idx]);
});

// DELETE /api/resume/:id — delete resume
router.delete('/:id', authMiddleware, (req, res) => {
  const resumes = getUserResumes(req.user.id);
  const idx = resumes.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Resume not found' });

  resumes.splice(idx, 1);
  const user = users[req.user.email];
  if (user && user.resumeCount > 0) user.resumeCount--;

  res.json({ success: true });
});

function getEmptyResumeData() {
  return {
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  };
}

module.exports = router;
