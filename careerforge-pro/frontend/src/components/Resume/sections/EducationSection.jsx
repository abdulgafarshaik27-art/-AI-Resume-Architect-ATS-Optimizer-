import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useResumeStore } from '../../../store'

export function EducationSection() {
  const { resumeData, updateEducation, addEducation, removeEducation } = useResumeStore()
  const education = resumeData.education || []

  return (
    <div className="space-y-3">
      <p className="section-heading">Education</p>
      {education.map((edu, i) => (
        <div key={edu.id || i} className="bg-white/3 border border-white/8 rounded-xl p-3 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">{edu.institution || 'University'}</p>
            <button onClick={() => removeEducation(i)} className="text-red-400/60 hover:text-red-400"><Trash2 size={13} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Degree</label>
              <input className="input text-xs" placeholder="Bachelor of Science" value={edu.degree || ''} onChange={e => updateEducation(i, 'degree', e.target.value)} />
            </div>
            <div>
              <label className="label">Field of Study</label>
              <input className="input text-xs" placeholder="Computer Science" value={edu.field || ''} onChange={e => updateEducation(i, 'field', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Institution</label>
            <input className="input text-xs" placeholder="MIT" value={edu.institution || ''} onChange={e => updateEducation(i, 'institution', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Graduation Year</label>
              <input className="input text-xs" placeholder="2022" value={edu.graduationYear || ''} onChange={e => updateEducation(i, 'graduationYear', e.target.value)} />
            </div>
            <div>
              <label className="label">GPA (optional)</label>
              <input className="input text-xs" placeholder="3.8" value={edu.gpa || ''} onChange={e => updateEducation(i, 'gpa', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <button onClick={addEducation} className="w-full flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-white/30 rounded-xl py-3 text-sm text-white/50 hover:text-white/80 transition-all">
        <Plus size={15} /> Add Education
      </button>
    </div>
  )
}

export function SkillsSection() {
  const { resumeData, setSkills } = useResumeStore()
  const skills = resumeData.skills || []

  // Flatten to simple string array for easy editing
  const flatSkills = skills.flatMap(s => {
    if (typeof s === 'string') return [s]
    if (s.items) return s.items
    return [s.name || '']
  }).filter(Boolean)

  const skillText = flatSkills.join(', ')

  const handleChange = (val) => {
    const arr = val.split(',').map(s => s.trim()).filter(Boolean)
    setSkills(arr)
  }

  return (
    <div className="space-y-3">
      <p className="section-heading">Skills</p>
      <div>
        <label className="label">Skills (comma-separated)</label>
        <textarea
          className="input resize-none"
          rows={6}
          placeholder="Python, React, Node.js, AWS, Docker, Agile, Leadership, SQL..."
          value={skillText}
          onChange={e => handleChange(e.target.value)}
        />
        <p className="text-white/30 text-xs mt-1">Tip: After AI analysis, missing JD keywords will be highlighted</p>
      </div>
      {flatSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {flatSkills.map(s => (
            <span key={s} className="bg-brand-600/20 border border-brand-500/30 text-brand-300 text-xs px-2.5 py-1 rounded-full">
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProjectsSection() {
  const { resumeData, updateProject, addProject, removeProject } = useResumeStore()
  const projects = resumeData.projects || []

  return (
    <div className="space-y-3">
      <p className="section-heading">Projects</p>
      {projects.map((proj, i) => (
        <div key={proj.id || i} className="bg-white/3 border border-white/8 rounded-xl p-3 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">{proj.name || 'Project'}</p>
            <button onClick={() => removeProject(i)} className="text-red-400/60 hover:text-red-400"><Trash2 size={13} /></button>
          </div>
          <div>
            <label className="label">Project Name</label>
            <input className="input text-xs" placeholder="E-commerce Platform" value={proj.name || ''} onChange={e => updateProject(i, 'name', e.target.value)} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input text-xs resize-none" rows={2} placeholder="Built a full-stack..." value={proj.description || ''} onChange={e => updateProject(i, 'description', e.target.value)} />
          </div>
          <div>
            <label className="label">Technologies (comma-separated)</label>
            <input className="input text-xs" placeholder="React, Node.js, MongoDB" value={(proj.technologies || []).join(', ')} onChange={e => updateProject(i, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} />
          </div>
          <div>
            <label className="label">URL (optional)</label>
            <input className="input text-xs" placeholder="github.com/user/project" value={proj.url || ''} onChange={e => updateProject(i, 'url', e.target.value)} />
          </div>
        </div>
      ))}
      <button onClick={addProject} className="w-full flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-white/30 rounded-xl py-3 text-sm text-white/50 hover:text-white/80 transition-all">
        <Plus size={15} /> Add Project
      </button>
    </div>
  )
}

export function CertificationsSection() {
  const { resumeData, setSkills } = useResumeStore()
  const certs = resumeData.certifications || []

  const setCerts = (newCerts) => {
    useResumeStore.setState(state => ({
      resumeData: { ...state.resumeData, certifications: newCerts }
    }))
  }

  const addCert = () => setCerts([...certs, { id: Date.now(), name: '', issuer: '', year: '' }])
  const removeCert = (i) => setCerts(certs.filter((_, idx) => idx !== i))
  const updateCert = (i, field, value) => {
    const updated = [...certs]
    updated[i] = { ...updated[i], [field]: value }
    setCerts(updated)
  }

  return (
    <div className="space-y-3">
      <p className="section-heading">Certifications</p>
      {certs.map((cert, i) => (
        <div key={cert.id || i} className="bg-white/3 border border-white/8 rounded-xl p-3 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">{cert.name || 'Certification'}</p>
            <button onClick={() => removeCert(i)} className="text-red-400/60 hover:text-red-400"><Trash2 size={13} /></button>
          </div>
          <div>
            <label className="label">Certification Name</label>
            <input className="input text-xs" placeholder="AWS Solutions Architect" value={cert.name || ''} onChange={e => updateCert(i, 'name', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label">Issuer</label>
              <input className="input text-xs" placeholder="Amazon" value={cert.issuer || ''} onChange={e => updateCert(i, 'issuer', e.target.value)} />
            </div>
            <div>
              <label className="label">Year</label>
              <input className="input text-xs" placeholder="2023" value={cert.year || ''} onChange={e => updateCert(i, 'year', e.target.value)} />
            </div>
          </div>
        </div>
      ))}
      <button onClick={addCert} className="w-full flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-white/30 rounded-xl py-3 text-sm text-white/50 hover:text-white/80 transition-all">
        <Plus size={15} /> Add Certification
      </button>
    </div>
  )
}

export default EducationSection
