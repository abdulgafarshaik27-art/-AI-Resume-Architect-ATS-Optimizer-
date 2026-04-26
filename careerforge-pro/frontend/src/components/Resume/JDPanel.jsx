import React, { useState } from 'react'
import { Target, Wand2, Loader2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { useResumeStore } from '../../store'
import api from '../../utils/api'

export default function JDPanel() {
  const {
    jobDescription, setJobDescription,
    jdAnalysis, setJdAnalysis,
    resumeData, setResumeData,
    setAtsScore, isAnalyzingJD, isRewriting,
  } = useResumeStore()

  const [analyzing, setAnalyzing] = useState(false)
  const [rewriting, setRewriting] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(true)
  const [rewriteSuccess, setRewriteSuccess] = useState(false)

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return
    setAnalyzing(true)
    setRewriteSuccess(false)
    try {
      const res = await api.post('/ai/analyze-jd', { jobDescription })
      setJdAnalysis(res.data)
      setShowAnalysis(true)

      // Also score immediately
      const scoreRes = await api.post('/ai/ats-score', {
        resumeData,
        jdAnalysis: res.data,
      })
      setAtsScore(scoreRes.data.score, scoreRes.data)
    } catch (err) {
      alert(err.response?.data?.error || 'JD analysis failed. Check your Anthropic API key.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleFullRewrite = async () => {
    if (!jdAnalysis) { alert('Please analyze the JD first'); return }
    if (!confirm('This will rewrite your entire resume to match the JD. Your original data stays unchanged if you cancel. Continue?')) return

    setRewriting(true)
    setRewriteSuccess(false)
    try {
      const res = await api.post('/ai/rewrite-resume', {
        resumeData,
        jdAnalysis,
        jobDescription,
      })
      setResumeData(res.data.rewritten)

      // Recalculate ATS score
      const scoreRes = await api.post('/ai/ats-score', {
        resumeData: res.data.rewritten,
        jdAnalysis,
      })
      setAtsScore(scoreRes.data.score, scoreRes.data)
      setRewriteSuccess(true)
    } catch (err) {
      alert(err.response?.data?.error || 'Full rewrite failed.')
    } finally {
      setRewriting(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* JD Input */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Target size={15} className="text-accent" />
          <span className="section-heading mb-0 border-none pb-0">Target Job Description</span>
        </div>
        <textarea
          className="input resize-none text-xs"
          rows={8}
          placeholder="Paste the full job description here...&#10;&#10;Example:&#10;We are looking for a Senior Software Engineer with experience in React, Node.js, AWS, and Agile methodologies. The ideal candidate has 5+ years of experience..."
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
        />
        <button
          onClick={handleAnalyze}
          disabled={analyzing || !jobDescription.trim()}
          className="mt-2 btn-primary w-full justify-center py-2.5 text-sm"
        >
          {analyzing ? <><Loader2 size={15} className="animate-spin" /> Analyzing JD…</> : <><Target size={15} /> Analyze Job Description</>}
        </button>
      </div>

      {/* JD Analysis Results */}
      {jdAnalysis && (
        <div className="card overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5"
            onClick={() => setShowAnalysis(!showAnalysis)}
          >
            <span className="text-sm font-semibold text-white/80">
              {jdAnalysis.jobTitle} · {jdAnalysis.seniorityLevel}
            </span>
            {showAnalysis ? <ChevronUp size={15} className="text-white/40" /> : <ChevronDown size={15} className="text-white/40" />}
          </button>

          {showAnalysis && (
            <div className="px-4 pb-4 space-y-3 border-t border-white/5">
              <KeywordGroup label="🔴 Must Have" keywords={jdAnalysis.mustHave} color="red" />
              <KeywordGroup label="🔵 Hard Skills" keywords={jdAnalysis.hardSkills} color="brand" />
              <KeywordGroup label="🟢 Soft Skills" keywords={jdAnalysis.softSkills} color="emerald" />
              <KeywordGroup label="🔧 Tools" keywords={jdAnalysis.tools} color="amber" />
              {jdAnalysis.certifications?.length > 0 && (
                <KeywordGroup label="📜 Certifications" keywords={jdAnalysis.certifications} color="purple" />
              )}
            </div>
          )}
        </div>
      )}

      {/* Full AI Rewrite */}
      {jdAnalysis && (
        <div className="card p-4 border-brand-500/20 bg-brand-900/10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-brand-400" />
            <span className="font-semibold text-sm">AI Full Resume Rewrite</span>
          </div>
          <p className="text-white/50 text-xs mb-3 leading-relaxed">
            Rewrites ALL bullet points + summary to match this JD's keywords. Instantly boosts your ATS score.
          </p>
          {rewriteSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-2 rounded-lg mb-3">
              ✅ Resume rewritten successfully! Check the preview tab.
            </div>
          )}
          <button
            onClick={handleFullRewrite}
            disabled={rewriting}
            className="w-full btn-primary justify-center py-2.5 text-sm ai-glow"
          >
            {rewriting
              ? <><Loader2 size={15} className="animate-spin" /> Rewriting entire resume…</>
              : <><Wand2 size={15} /> Rewrite Entire Resume with AI</>}
          </button>
        </div>
      )}
    </div>
  )
}

function KeywordGroup({ label, keywords = [], color }) {
  if (!keywords.length) return null
  const colorMap = {
    red: 'bg-red-500/10 text-red-300 border-red-500/20',
    brand: 'bg-brand-500/10 text-brand-300 border-brand-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  }
  return (
    <div>
      <p className="text-xs text-white/50 mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {keywords.map(kw => (
          <span key={kw} className={`text-xs px-2 py-0.5 rounded-full border ${colorMap[color] || colorMap.brand}`}>{kw}</span>
        ))}
      </div>
    </div>
  )
}
