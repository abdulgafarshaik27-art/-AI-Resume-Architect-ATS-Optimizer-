import React, { useState } from 'react'
import { Plus, Trash2, Wand2, Loader2, ChevronDown, ChevronUp, X } from 'lucide-react'
import { useResumeStore } from '../../../store'
import api from '../../../utils/api'

export default function ExperienceSection() {
  const {
    resumeData, updateExperience, addExperience, removeExperience,
    updateBullet, addBullet, removeBullet, jdAnalysis,
  } = useResumeStore()
  const experience = resumeData.experience || []
  const [collapsed, setCollapsed] = useState({})
  const [rewritingBullet, setRewritingBullet] = useState(null) // "expIdx-bulletIdx"

  const toggleCollapse = (i) => setCollapsed(c => ({ ...c, [i]: !c[i] }))

  const handleRewriteBullet = async (expIdx, bulletIdx) => {
    const key = `${expIdx}-${bulletIdx}`
    const bullet = experience[expIdx].bullets[bulletIdx]
    if (!bullet.trim()) return

    setRewritingBullet(key)
    try {
      const keywords = jdAnalysis
        ? [...(jdAnalysis.mustHave || []), ...(jdAnalysis.hardSkills || [])].slice(0, 8)
        : []
      const res = await api.post('/ai/rewrite-bullet', {
        bullet,
        keywords,
        role: experience[expIdx].title,
      })
      updateBullet(expIdx, bulletIdx, res.data.rewritten)
    } catch (err) {
      alert(err.response?.data?.error || 'Rewrite failed. Check your API key.')
    } finally {
      setRewritingBullet(null)
    }
  }

  return (
    <div className="space-y-3">
      <p className="section-heading">Work Experience</p>

      {experience.length === 0 && (
        <p className="text-white/30 text-sm text-center py-6">No experience added yet</p>
      )}

      {experience.map((exp, i) => (
        <div key={exp.id || i} className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-white/5" onClick={() => toggleCollapse(i)}>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{exp.title || 'Untitled Role'}</p>
              {exp.company && <p className="text-xs text-white/40 truncate">{exp.company}</p>}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={e => { e.stopPropagation(); removeExperience(i) }} className="text-red-400/60 hover:text-red-400 p-1">
                <Trash2 size={13} />
              </button>
              {collapsed[i] ? <ChevronDown size={15} className="text-white/40" /> : <ChevronUp size={15} className="text-white/40" />}
            </div>
          </div>

          {!collapsed[i] && (
            <div className="px-3 pb-3 space-y-2.5 border-t border-white/5 pt-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">Job Title</label>
                  <input className="input text-xs" placeholder="Software Engineer" value={exp.title || ''} onChange={e => updateExperience(i, 'title', e.target.value)} />
                </div>
                <div>
                  <label className="label">Company</label>
                  <input className="input text-xs" placeholder="Acme Corp" value={exp.company || ''} onChange={e => updateExperience(i, 'company', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input text-xs" placeholder="San Francisco, CA" value={exp.location || ''} onChange={e => updateExperience(i, 'location', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">Start Date</label>
                  <input className="input text-xs" placeholder="Jan 2021" value={exp.startDate || ''} onChange={e => updateExperience(i, 'startDate', e.target.value)} />
                </div>
                <div>
                  <label className="label">End Date</label>
                  <input className="input text-xs" placeholder="Present" value={exp.current ? 'Present' : (exp.endDate || '')} disabled={exp.current} onChange={e => updateExperience(i, 'endDate', e.target.value)} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer">
                <input type="checkbox" checked={exp.current || false} onChange={e => updateExperience(i, 'current', e.target.checked)} className="rounded" />
                Currently working here
              </label>

              {/* Bullets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label mb-0">Bullet Points</label>
                  <span className="text-white/30 text-xs">Click ✨ to AI-rewrite</span>
                </div>
                <div className="space-y-2">
                  {(exp.bullets || []).map((bullet, bi) => {
                    const key = `${i}-${bi}`
                    const isRw = rewritingBullet === key
                    return (
                      <div key={bi} className="flex gap-2 items-start">
                        <div className="flex-1 relative">
                          <textarea
                            className="input text-xs resize-none pr-8"
                            rows={2}
                            placeholder="Led development of..."
                            value={bullet}
                            onChange={e => updateBullet(i, bi, e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => handleRewriteBullet(i, bi)}
                          disabled={isRw || !bullet.trim()}
                          title="AI Rewrite"
                          className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-600/20 hover:bg-brand-600/40 text-brand-400 flex items-center justify-center transition-all disabled:opacity-30 mt-0.5"
                        >
                          {isRw ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
                        </button>
                        {exp.bullets.length > 1 && (
                          <button onClick={() => removeBullet(i, bi)} className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center mt-0.5">
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    )
                  })}
                  <button onClick={() => addBullet(i)} className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors">
                    <Plus size={12} /> Add bullet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button onClick={addExperience} className="w-full flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-white/30 rounded-xl py-3 text-sm text-white/50 hover:text-white/80 transition-all">
        <Plus size={15} /> Add Experience
      </button>
    </div>
  )
}
