const express = require('express');
const https = require('https');
const auth = require('../middleware/auth');
const router = express.Router();

function ask(prompt, maxTokens) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens || 2000,
      temperature: 0.7
    });
    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message));
          resolve(parsed.choices[0].message.content.trim());
        } catch (e) {
          reject(new Error('Parse error: ' + data.substring(0, 300)));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

router.post('/analyze-jd', auth, async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) return res.status(400).json({ error: 'jobDescription is required' });
    const text = await ask('Analyze this job description and extract keywords.\nJD: ' + jobDescription + '\nRespond ONLY with valid JSON no markdown:\n{"hardSkills":["s1"],"softSkills":["s1"],"tools":["t1"],"certifications":["c1"],"keyPhrases":["p1"],"jobTitle":"title","seniorityLevel":"Mid","mustHave":["k1"],"niceToHave":["k2"]}');
    res.json(JSON.parse(text.replace(/```json|```/g, '').trim()));
  } catch (e) {
    res.status(500).json({ error: 'JD analysis failed: ' + e.message });
  }
});

router.post('/rewrite-bullet', auth, async (req, res) => {
  try {
    const { bullet, keywords } = req.body;
    if (!bullet) return res.status(400).json({ error: 'bullet required' });
    const kw = (keywords || []).slice(0, 10).join(', ');
    const text = await ask('Rewrite this resume bullet with action verb. Include keywords: ' + kw + '.\nBullet: ' + bullet + '\nReturn ONLY rewritten bullet. No quotes.', 300);
    res.json({ rewritten: text });
  } catch (e) {
    res.status(500).json({ error: 'Rewrite failed' });
  }
});

router.post('/rewrite-resume', auth, async (req, res) => {
  try {
    const { resumeData, jdAnalysis } = req.body;
    if (!resumeData || !jdAnalysis) return res.status(400).json({ error: 'required' });
    const kw = [].concat(jdAnalysis.mustHave || [], jdAnalysis.hardSkills || []).join(', ');
    const text = await ask('Rewrite this resume for ' + jdAnalysis.jobTitle + '. Keywords: ' + kw + '. Resume JSON: ' + JSON.stringify(resumeData) + '. Keep dates/companies same. Return ONLY valid JSON same schema.', 4000);
    res.json({ rewritten: JSON.parse(text.replace(/```json|```/g, '').trim()) });
  } catch (e) {
    res.status(500).json({ error: 'Rewrite failed' });
  }
});

router.post('/ats-score', auth, async (req, res) => {
  try {
    const { resumeData, jdAnalysis } = req.body;
    if (!resumeData || !jdAnalysis) return res.status(400).json({ error: 'required' });
    const parts = [];
    if (resumeData.personalInfo && resumeData.personalInfo.summary) parts.push(resumeData.personalInfo.summary);
    (resumeData.experience || []).forEach(function(e) {
      parts.push(e.title || '', e.company || '');
      (e.bullets || []).forEach(function(b) { parts.push(b); });
    });
    (resumeData.skills || []).forEach(function(s) {
      if (typeof s === 'string') parts.push(s);
      else if (s.items) parts.push.apply(parts, s.items);
      else if (s.name) parts.push(s.name);
    });
    const txt = parts.join(' ').toLowerCase();
    const all = [].concat(jdAnalysis.mustHave || [], jdAnalysis.hardSkills || [], jdAnalysis.softSkills || [], jdAnalysis.tools || []);
    const matched = all.filter(function(k) { return txt.includes(k.toLowerCase()); });
    const missing = all.filter(function(k) { return !txt.includes(k.toLowerCase()); });
    let score = 0, total = 0;
    (jdAnalysis.mustHave || []).forEach(function(k) { total += 3; if (txt.includes(k.toLowerCase())) score += 3; });
    (jdAnalysis.hardSkills || []).forEach(function(k) { total += 2; if (txt.includes(k.toLowerCase())) score += 2; });
    [].concat(jdAnalysis.softSkills || [], jdAnalysis.tools || []).forEach(function(k) { total += 1; if (txt.includes(k.toLowerCase())) score += 1; });
    res.json({ score: total > 0 ? Math.round(score / total * 100) : 0, matched: matched, missing: missing, totalKeywords: all.length, matchedCount: matched.length });
  } catch (e) {
    res.status(500).json({ error: 'ATS score failed' });
  }
});

router.post('/cover-letter', auth, async (req, res) => {
  try {
    if (req.user.plan !== 'pro') return res.status(403).json({ error: 'Pro only', upgrade: true });
    const { resumeData, jobDescription, companyName } = req.body;
    const text = await ask('Write 3-paragraph cover letter for ' + (resumeData.personalInfo && resumeData.personalInfo.fullName || 'Applicant') + ' at ' + (companyName || 'company') + '. Job: ' + jobDescription + '. Return ONLY letter text.', 800);
    res.json({ coverLetter: text });
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

module.exports = router;