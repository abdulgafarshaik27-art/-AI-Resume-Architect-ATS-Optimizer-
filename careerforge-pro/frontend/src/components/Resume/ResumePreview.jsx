import React, { useMemo } from 'react'
import { useResumeStore } from '../../store'

// Inline CSS for the preview (mirrors backend template styles)
function buildPreviewHtml(data, template) {
  const { personalInfo = {}, experience = [], education = [], skills = [], projects = [], certifications = [] } = data

  const allSkillsList = skills.flatMap(s => {
    if (typeof s === 'string') return [s]
    if (s.items) return s.items
    return [s.name || s]
  }).filter(Boolean)

  if (template === 'classic') {
    return `<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Source+Serif+4:wght@400;600&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Merriweather', serif; font-size: 10.5pt; color: #111; background: white; padding: 36px; }
.name { font-size: 22pt; font-weight: 700; text-align: center; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px; }
.contact { text-align: center; font-size: 9pt; color: #555; margin-bottom: 16px; }
hr { border: none; border-top: 1.5px solid #111; margin: 10px 0; }
h2 { font-size: 10pt; text-transform: uppercase; letter-spacing: 1.5px; margin: 14px 0 8px; font-weight: 700; }
.row { display: flex; justify-content: space-between; }
.entry { margin-bottom: 10px; }
.entry-title { font-weight: 700; font-size: 10pt; }
.entry-sub { font-size: 9.5pt; color: #444; }
.date { font-style: italic; font-size: 9pt; color: #666; white-space: nowrap; }
ul { padding-left: 18px; margin-top: 4px; }
li { font-size: 9.5pt; line-height: 1.55; margin-bottom: 2px; }
p { font-size: 9.5pt; line-height: 1.6; }
</style></head><body>
<div class="name">${personalInfo.fullName || 'Your Name'}</div>
<div class="contact">${[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin].filter(Boolean).join(' | ')}</div>
<hr/>
${personalInfo.summary ? `<h2>Professional Summary</h2><p>${personalInfo.summary}</p>` : ''}
${experience.length > 0 ? `<h2>Experience</h2>${experience.map(e => `<div class="entry"><div class="row"><div><span class="entry-title">${e.title || ''}</span><span class="entry-sub"> — ${e.company || ''}${e.location ? ', ' + e.location : ''}</span></div><span class="date">${e.startDate || ''} – ${e.current ? 'Present' : (e.endDate || '')}</span></div><ul>${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}</ul></div>`).join('')}` : ''}
${education.length > 0 ? `<h2>Education</h2>${education.map(e => `<div class="entry"><div class="row"><div><span class="entry-title">${e.degree || ''} ${e.field || ''}</span><span class="entry-sub"> — ${e.institution || ''}</span></div><span class="date">${e.graduationYear || ''}</span></div></div>`).join('')}` : ''}
${allSkillsList.length > 0 ? `<h2>Skills</h2><p>${allSkillsList.join(' · ')}</p>` : ''}
</body></html>`
  }

  // Modern template
  return `<!DOCTYPE html><html><head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: 'Inter', sans-serif; font-size: 9.5pt; color: #1a1a2e; background: white; }
.header { background: linear-gradient(135deg,#1a1a2e,#16213e); color:white; padding: 28px 32px 24px; }
.name { font-family:'Playfair Display',serif; font-size:26pt; font-weight:700; margin-bottom:8px; }
.contact { display:flex; flex-wrap:wrap; gap:14px; font-size:8pt; opacity:.82; margin-bottom:12px; }
.summary { font-size:8.5pt; line-height:1.6; opacity:.88; border-left:3px solid #e94560; padding-left:12px; max-width:600px; }
.body { display:flex; }
.main { flex:1; padding: 20px 26px; }
.side { width:190px; background:#f8f9ff; padding: 20px 16px; border-left:1px solid #e8eaf6; }
.sec-title { font-size:8pt; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:#e94560; margin-bottom:12px; padding-bottom:5px; border-bottom:2px solid #e94560; }
section { margin-bottom:20px; }
.entry { margin-bottom:12px; }
.eh { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:3px; }
.et { font-weight:600; font-size:9.5pt; }
.es { font-size:8pt; color:#555; margin-bottom:3px; }
.ed { font-size:7.5pt; color:#888; white-space:nowrap; margin-left:6px; }
ul { padding-left:14px; }
li { font-size:8.5pt; line-height:1.5; margin-bottom:2.5px; color:#333; }
.stag { display:inline-block; background:#e8eaf6; color:#3f51b5; padding:2.5px 7px; border-radius:3px; font-size:7.5pt; margin:2px; }
</style></head><body>
<div class="header">
  <div class="name">${personalInfo.fullName || 'Your Name'}</div>
  <div class="contact">
    ${personalInfo.email ? `<span>✉ ${personalInfo.email}</span>` : ''}
    ${personalInfo.phone ? `<span>📞 ${personalInfo.phone}</span>` : ''}
    ${personalInfo.location ? `<span>📍 ${personalInfo.location}</span>` : ''}
    ${personalInfo.linkedin ? `<span>🔗 ${personalInfo.linkedin}</span>` : ''}
  </div>
  ${personalInfo.summary ? `<div class="summary">${personalInfo.summary}</div>` : ''}
</div>
<div class="body">
  <div class="main">
    ${experience.length > 0 ? `<section><div class="sec-title">Experience</div>${experience.map(e => `<div class="entry"><div class="eh"><div><div class="et">${e.title || ''}</div><div class="es">${e.company || ''}${e.location ? ' — ' + e.location : ''}</div></div><div class="ed">${e.startDate || ''} – ${e.current ? 'Present' : (e.endDate || '')}</div></div><ul>${(e.bullets || []).map(b => b ? `<li>${b}</li>` : '').join('')}</ul></div>`).join('')}</section>` : ''}
    ${education.length > 0 ? `<section><div class="sec-title">Education</div>${education.map(e => `<div class="entry"><div class="eh"><div><div class="et">${e.degree || ''} ${e.field || ''}</div><div class="es">${e.institution || ''}</div></div><div class="ed">${e.graduationYear || ''}</div></div></div>`).join('')}</section>` : ''}
    ${projects.length > 0 ? `<section><div class="sec-title">Projects</div>${projects.map(p => `<div class="entry"><div class="et">${p.name || ''}</div><div class="es">${p.description || ''}</div></div>`).join('')}</section>` : ''}
  </div>
  <div class="side">
    ${allSkillsList.length > 0 ? `<section><div class="sec-title">Skills</div>${allSkillsList.map(s => `<span class="stag">${s}</span>`).join('')}</section>` : ''}
    ${certifications.length > 0 ? `<section><div class="sec-title">Certs</div>${certifications.map(c => `<div style="font-size:8pt;margin-bottom:6px"><strong>${c.name || c}</strong>${c.issuer ? '<br><span style="color:#666;font-size:7.5pt">'+c.issuer+'</span>' : ''}</div>`).join('')}</section>` : ''}
  </div>
</div>
</body></html>`
}

export default function ResumePreview() {
  const { resumeData, selectedTemplate } = useResumeStore()

  const html = useMemo(
    () => buildPreviewHtml(resumeData, selectedTemplate),
    [resumeData, selectedTemplate]
  )

  return (
    <div className="h-full bg-gray-200 flex items-start justify-center p-4 overflow-auto">
      <div className="bg-white shadow-2xl" style={{ width: '794px', minHeight: '1123px', flexShrink: 0 }}>
        <iframe
          srcDoc={html}
          title="Resume Preview"
          style={{ width: '794px', height: '1123px', border: 'none', display: 'block' }}
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  )
}
