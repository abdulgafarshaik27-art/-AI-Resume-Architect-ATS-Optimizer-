import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, Download, ArrowLeft, Loader2, Crown } from 'lucide-react'
import { useResumeStore, useAuthStore } from '../store'
import api from '../utils/api'

import ResumeForm from '../components/Resume/ResumeForm'
import ResumePreview from '../components/Resume/ResumePreview'
import JDPanel from '../components/Resume/JDPanel'
import ATSScore from '../components/Resume/ATSScore'
import CoverLetterModal from '../components/Resume/CoverLetterModal'

export default function BuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const {
    resumeTitle, setResumeTitle, resumeData, isSaving, saveResume,
    selectedTemplate, setTemplate, atsScore, jdAnalysis, jobDescription,
    resumeId, loadResume,
  } = useResumeStore()

  const [rightTab, setRightTab] = useState('preview') // 'preview' | 'jd'
  const [isExporting, setIsExporting] = useState(false)
  const [showCoverLetter, setShowCoverLetter] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [loadingResume, setLoadingResume] = useState(false)

  // Load resume if editing existing
  useEffect(() => {
    if (id && id !== resumeId) {
      setLoadingResume(true)
      api.get(`/resume/${id}`)
        .then(res => loadResume(res.data))
        .catch(() => navigate('/dashboard'))
        .finally(() => setLoadingResume(false))
    }
  }, [id])

  const handleSave = async () => {
    setSaveError(null)
    const result = await saveResume()
    if (!result.success) {
      if (result.upgrade) {
        if (confirm(`${result.error}\n\nUpgrade to Pro?`)) {
          const res = await api.post('/stripe/create-checkout').catch(() => null)
          if (res?.data?.url) window.location.href = res.data.url
        }
      } else {
        setSaveError(result.error)
      }
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const res = await api.post('/pdf/generate', {
        resumeData,
        template: selectedTemplate,
      }, { responseType: 'blob' })

      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `${resumeData.personalInfo?.fullName || 'resume'}-${Date.now()}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('PDF export failed. Make sure the backend is running and Puppeteer is installed.')
    } finally {
      setIsExporting(false)
    }
  }

  if (loadingResume) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand-500" />
      </div>
    )
  }

  return (
    <div className="h-screen bg-[#0a0a14] flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5 border-b border-white/5 bg-[#0f0f1a]">
        <button onClick={() => navigate('/dashboard')} className="text-white/50 hover:text-white transition-colors p-1">
          <ArrowLeft size={18} />
        </button>

        <input
          type="text"
          value={resumeTitle}
          onChange={e => useResumeStore.getState().resumeTitle = e.target.value || 'My Resume'}
          onBlur={e => useResumeStore.setState({ resumeTitle: e.target.value || 'My Resume' })}
          className="bg-transparent text-white font-semibold text-sm focus:outline-none focus:bg-white/5 rounded px-2 py-1 w-48 border border-transparent focus:border-white/20"
          placeholder="Resume Title"
        />

        <div className="ml-auto flex items-center gap-2">
          {/* Template selector */}
          <select
            value={selectedTemplate}
            onChange={e => setTemplate(e.target.value)}
            style={{backgroundColor:"#1a1a2e",color:"rgba(255,255,255,0.8)"}} className="border border-white/15 text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="modern">Modern Template</option>
            <option value="classic">Classic Template</option>
          </select>

          {/* ATS score badge */}
          {atsScore !== null && (
            <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg ${atsScore >= 70 ? 'bg-emerald-500/15 text-emerald-400' : atsScore >= 40 ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'}`}>
              ATS: {atsScore}%
            </div>
          )}

          {/* Cover Letter (Pro) */}
          {user?.plan === 'pro' && (
            <button onClick={() => setShowCoverLetter(true)} className="btn-secondary text-xs py-1.5 px-3">
              <Crown size={13} /> Cover Letter
            </button>
          )}

          {/* Save */}
          <button onClick={handleSave} disabled={isSaving} className="btn-secondary text-xs py-1.5 px-3">
            {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {isSaving ? 'Saving…' : 'Save'}
          </button>

          {/* Export PDF */}
          <button onClick={handleExportPDF} disabled={isExporting} className="btn-primary text-xs py-1.5 px-3">
            {isExporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            {isExporting ? 'Exporting…' : 'Export PDF'}
          </button>
        </div>
      </header>

      {saveError && (
        <div className="bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs px-4 py-2 text-center">
          {saveError}
        </div>
      )}

      {/* Main split layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Resume form */}
        <div className="w-[420px] flex-shrink-0 border-r border-white/5 overflow-y-auto">
          <ResumeForm />
        </div>

        {/* RIGHT: Preview / JD tabs */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-white/5 bg-[#0f0f1a]">
            <button
              onClick={() => setRightTab('preview')}
              className={`px-5 py-2.5 text-xs font-semibold transition-colors ${rightTab === 'preview' ? 'text-white border-b-2 border-brand-500' : 'text-white/40 hover:text-white/70'}`}
            >
              Live Preview
            </button>
            <button
              onClick={() => setRightTab('jd')}
              className={`px-5 py-2.5 text-xs font-semibold transition-colors flex items-center gap-1.5 ${rightTab === 'jd' ? 'text-white border-b-2 border-accent' : 'text-white/40 hover:text-white/70'}`}
            >
              JD & AI Optimizer
              {atsScore !== null && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {rightTab === 'preview' ? (
              <ResumePreview />
            ) : (
              <div className="h-full overflow-y-auto">
                <JDPanel />
                {atsScore !== null && <ATSScore />}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCoverLetter && <CoverLetterModal onClose={() => setShowCoverLetter(false)} />}
    </div>
  )
}
