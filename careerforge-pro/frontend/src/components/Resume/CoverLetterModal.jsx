import React, { useState } from 'react'
import { X, Wand2, Loader2, Copy, Check } from 'lucide-react'
import { useResumeStore } from '../../store'
import api from '../../utils/api'

export default function CoverLetterModal({ onClose }) {
  const { resumeData, jobDescription } = useResumeStore()
  const [companyName, setCompanyName] = useState('')
  const [hiringManager, setHiringManager] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await api.post('/ai/cover-letter', {
        resumeData,
        jobDescription,
        companyName,
        hiringManager,
      })
      setCoverLetter(res.data.coverLetter)
    } catch (err) {
      alert(err.response?.data?.error || 'Cover letter generation failed.')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h2 className="font-display font-bold text-lg">AI Cover Letter Generator</h2>
            <p className="text-white/40 text-xs mt-0.5">Pro feature — powered by Claude AI</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Company Name</label>
              <input
                className="input"
                placeholder="Acme Corp"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Hiring Manager (optional)</label>
              <input
                className="input"
                placeholder="Sarah Johnson"
                value={hiringManager}
                onChange={e => setHiringManager(e.target.value)}
              />
            </div>
          </div>

          {!jobDescription.trim() && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-4 py-3 rounded-lg">
              ⚠️ No job description found. Go to the JD tab and paste a job description for a better tailored cover letter.
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full btn-primary justify-center py-3 ai-glow"
          >
            {generating
              ? <><Loader2 size={15} className="animate-spin" /> Generating cover letter…</>
              : <><Wand2 size={15} /> Generate Cover Letter</>}
          </button>

          {/* Output */}
          {coverLetter && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label mb-0">Generated Cover Letter</label>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
                >
                  {copied ? <><Check size={12} className="text-emerald-400" /> Copied!</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              <textarea
                className="input resize-none text-sm leading-relaxed"
                rows={16}
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
              />
              <p className="text-white/30 text-xs mt-1">You can edit the text above before copying</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
