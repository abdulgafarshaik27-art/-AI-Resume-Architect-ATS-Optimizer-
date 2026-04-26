/**
 * Generates complete standalone HTML for a resume (used by Puppeteer for PDF export).
 * Supports 'modern' and 'classic' templates.
 */
function getResumeHtml(data, template = 'modern') {
  const { personalInfo = {}, experience = [], education = [], skills = [], projects = [], certifications = [] } = data;

  const styles = template === 'classic' ? getClassicStyles() : getModernStyles();
  const body = template === 'classic' ? renderClassic(data) : renderModern(data);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${personalInfo.fullName || 'Resume'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
  <style>${styles}</style>
</head>
<body>${body}</body>
</html>`;
}

// ─── MODERN TEMPLATE ───────────────────────────────────────────────
function renderModern(data) {
  const { personalInfo = {}, experience = [], education = [], skills = [], projects = [], certifications = [] } = data;

  const skillsHtml = skills.map(s => {
    if (typeof s === 'string') return `<span class="skill-tag">${s}</span>`;
    if (s.items) return `<div class="skill-group"><strong>${s.category}:</strong> ${s.items.join(', ')}</div>`;
    return `<span class="skill-tag">${s.name || s}</span>`;
  }).join('');

  const expHtml = experience.map(exp => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <div class="entry-title">${exp.title || ''}</div>
          <div class="entry-sub">${exp.company || ''}${exp.location ? ` — ${exp.location}` : ''}</div>
        </div>
        <div class="entry-date">${exp.startDate || ''} – ${exp.current ? 'Present' : (exp.endDate || '')}</div>
      </div>
      <ul class="bullets">
        ${(exp.bullets || []).map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  const eduHtml = education.map(edu => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <div class="entry-title">${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}</div>
          <div class="entry-sub">${edu.institution || ''}</div>
        </div>
        <div class="entry-date">${edu.graduationYear || ''}</div>
      </div>
      ${edu.gpa ? `<div class="entry-sub">GPA: ${edu.gpa}</div>` : ''}
    </div>
  `).join('');

  const projHtml = projects.length > 0 ? `
    <section>
      <h2 class="section-title">Projects</h2>
      ${projects.map(p => `
        <div class="entry">
          <div class="entry-header">
            <div class="entry-title">${p.name || ''}</div>
            ${p.url ? `<a href="${p.url}" class="entry-date">${p.url}</a>` : ''}
          </div>
          <p class="entry-sub">${p.description || ''}</p>
          ${p.technologies ? `<div class="tech-tags">${p.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>` : ''}
        </div>
      `).join('')}
    </section>
  ` : '';

  const certHtml = certifications.length > 0 ? `
    <section>
      <h2 class="section-title">Certifications</h2>
      ${certifications.map(c => `
        <div class="cert-item">
          <strong>${c.name || c}</strong>${c.issuer ? ` — ${c.issuer}` : ''}${c.year ? ` (${c.year})` : ''}
        </div>
      `).join('')}
    </section>
  ` : '';

  return `
  <div class="resume">
    <header class="header">
      <div class="header-name">${personalInfo.fullName || 'Your Name'}</div>
      <div class="header-contact">
        ${personalInfo.email ? `<span>✉ ${personalInfo.email}</span>` : ''}
        ${personalInfo.phone ? `<span>📞 ${personalInfo.phone}</span>` : ''}
        ${personalInfo.location ? `<span>📍 ${personalInfo.location}</span>` : ''}
        ${personalInfo.linkedin ? `<span>🔗 ${personalInfo.linkedin}</span>` : ''}
        ${personalInfo.website ? `<span>🌐 ${personalInfo.website}</span>` : ''}
      </div>
      ${personalInfo.summary ? `<div class="summary">${personalInfo.summary}</div>` : ''}
    </header>

    <div class="resume-body">
      <div class="main-col">
        ${experience.length > 0 ? `
        <section>
          <h2 class="section-title">Experience</h2>
          ${expHtml}
        </section>` : ''}

        ${education.length > 0 ? `
        <section>
          <h2 class="section-title">Education</h2>
          ${eduHtml}
        </section>` : ''}

        ${projHtml}
        ${certHtml}
      </div>

      <div class="side-col">
        ${skills.length > 0 ? `
        <section>
          <h2 class="section-title">Skills</h2>
          <div class="skills-container">${skillsHtml}</div>
        </section>` : ''}
      </div>
    </div>
  </div>`;
}

// ─── CLASSIC TEMPLATE ────────────────────────────────────────────────
function renderClassic(data) {
  const { personalInfo = {}, experience = [], education = [], skills = [], projects = [], certifications = [] } = data;

  const allSkills = skills.flatMap(s => {
    if (typeof s === 'string') return [s];
    if (s.items) return s.items;
    return [s.name || s];
  });

  const expHtml = experience.map(exp => `
    <div class="entry">
      <table class="entry-table"><tr>
        <td><strong>${exp.title || ''}</strong>, ${exp.company || ''}${exp.location ? `, ${exp.location}` : ''}</td>
        <td class="date-cell">${exp.startDate || ''} – ${exp.current ? 'Present' : (exp.endDate || '')}</td>
      </tr></table>
      <ul>${(exp.bullets || []).map(b => `<li>${b}</li>`).join('')}</ul>
    </div>
  `).join('');

  const eduHtml = education.map(edu => `
    <div class="entry">
      <table class="entry-table"><tr>
        <td><strong>${edu.degree || ''} ${edu.field || ''}</strong> — ${edu.institution || ''}</td>
        <td class="date-cell">${edu.graduationYear || ''}</td>
      </tr></table>
    </div>
  `).join('');

  return `
  <div class="resume-classic">
    <div class="classic-header">
      <h1>${personalInfo.fullName || 'Your Name'}</h1>
      <div class="classic-contact">
        ${[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin].filter(Boolean).join(' | ')}
      </div>
    </div>

    ${personalInfo.summary ? `<div class="classic-section"><h2>PROFESSIONAL SUMMARY</h2><p>${personalInfo.summary}</p></div>` : ''}

    ${experience.length > 0 ? `<div class="classic-section"><h2>EXPERIENCE</h2>${expHtml}</div>` : ''}

    ${education.length > 0 ? `<div class="classic-section"><h2>EDUCATION</h2>${eduHtml}</div>` : ''}

    ${allSkills.length > 0 ? `<div class="classic-section"><h2>SKILLS</h2><p>${allSkills.join(' • ')}</p></div>` : ''}
  </div>`;
}

// ─── MODERN STYLES ──────────────────────────────────────────────────
function getModernStyles() {
  return `
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; font-size: 10pt; color: #1a1a2e; background: white; }
    .resume { width: 210mm; min-height: 297mm; padding: 0; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 32px 36px 28px; }
    .header-name { font-family: 'Playfair Display', serif; font-size: 28pt; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 10px; }
    .header-contact { display: flex; flex-wrap: wrap; gap: 16px; font-size: 8.5pt; opacity: 0.85; margin-bottom: 14px; }
    .summary { font-size: 9pt; line-height: 1.6; opacity: 0.9; max-width: 680px; border-left: 3px solid #e94560; padding-left: 14px; }
    .resume-body { display: flex; gap: 0; }
    .main-col { flex: 1; padding: 24px 28px; }
    .side-col { width: 200px; background: #f8f9ff; padding: 24px 20px; border-left: 1px solid #e8eaf6; }
    .section-title { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #e94560; margin-bottom: 14px; padding-bottom: 6px; border-bottom: 2px solid #e94560; }
    section { margin-bottom: 24px; }
    .entry { margin-bottom: 14px; }
    .entry-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
    .entry-title { font-weight: 600; font-size: 10pt; color: #1a1a2e; }
    .entry-sub { font-size: 8.5pt; color: #555; margin-bottom: 4px; }
    .entry-date { font-size: 8pt; color: #888; white-space: nowrap; margin-left: 8px; }
    .bullets { padding-left: 16px; }
    .bullets li { font-size: 9pt; line-height: 1.55; margin-bottom: 3px; color: #333; }
    .skills-container { display: flex; flex-direction: column; gap: 6px; }
    .skill-tag { display: inline-block; background: #e8eaf6; color: #3f51b5; padding: 3px 8px; border-radius: 3px; font-size: 8pt; margin: 2px 2px; }
    .skill-group { font-size: 8.5pt; margin-bottom: 6px; color: #444; }
    .tech-tags { margin-top: 4px; }
    .tech-tag { display: inline-block; background: #fff3e0; color: #e65100; padding: 2px 6px; border-radius: 2px; font-size: 7.5pt; margin: 1px; }
    .cert-item { font-size: 9pt; margin-bottom: 6px; color: #333; }
  `;
}

// ─── CLASSIC STYLES ─────────────────────────────────────────────────
function getClassicStyles() {
  return `
    @page { size: A4; margin: 20mm 18mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; color: #000; background: white; }
    .resume-classic { max-width: 174mm; }
    .classic-header { text-align: center; margin-bottom: 18px; padding-bottom: 10px; border-bottom: 2px solid #000; }
    .classic-header h1 { font-size: 22pt; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
    .classic-contact { font-size: 9.5pt; color: #333; margin-top: 6px; }
    .classic-section { margin-bottom: 16px; }
    .classic-section h2 { font-size: 10pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 10px; }
    .entry { margin-bottom: 10px; }
    .entry-table { width: 100%; border-collapse: collapse; }
    .entry-table td { vertical-align: top; font-size: 10.5pt; }
    .date-cell { text-align: right; white-space: nowrap; font-style: italic; font-size: 9.5pt; color: #444; }
    ul { padding-left: 20px; margin-top: 4px; }
    li { font-size: 10pt; line-height: 1.5; margin-bottom: 2px; }
    p { font-size: 10pt; line-height: 1.6; }
  `;
}

module.exports = { getResumeHtml };
