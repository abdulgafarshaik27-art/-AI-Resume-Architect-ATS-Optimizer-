const express = require('express');
const puppeteer = require('puppeteer');
const authMiddleware = require('../middleware/auth');
const { getResumeHtml } = require('../templates/resumeTemplate');

const router = express.Router();

// POST /api/pdf/generate
router.post('/generate', authMiddleware, async (req, res) => {
  let browser;
  try {
    const { resumeData, template = 'modern' } = req.body;
    if (!resumeData) return res.status(400).json({ error: 'resumeData is required' });

    const html = getResumeHtml(resumeData, template);

    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();

    // Set content and wait for fonts/images
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF with professional settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      preferCSSPageSize: true,
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="resume-${Date.now()}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    console.error('PDF generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF: ' + err.message });
  }
});

module.exports = router;
