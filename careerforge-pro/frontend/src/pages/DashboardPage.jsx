import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, FileText, Trash2, Edit3, Zap, LogOut, Crown, TrendingUp } from 'lucide-react'
import { useAuthStore, useResumeStore } from '../store'
import api from '../utils/api'

export default function DashboardPage() {
  const { user, logout, refreshUser } = useAuthStore()
  const { resetEditor, loadResume } = useResumeStore()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    fetchResumes()
    if (searchParams.get('upgraded') === 'true') {
      refreshUser()
    }
  }, [])

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resume')
      setResumes(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    resetEditor()
    navigate('/builder')
  }

  const handleEdit = async (resume) => {
    try {
      const res = await api.get(`/resume/${resume.id}`)
      loadResume(res.data)
      navigate(`/builder/${resume.id}`)
    } catch (err) {
      alert('Failed to load resume')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume?')) return
    setDeletingId(id)
    try {
      await api.delete(`/resume/${id}`)
      setResumes(r => r.filter(x => x.id !== id))
      refreshUser()
    } catch (err) {
      alert('Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  const handleUpgrade = async () => {
    try {
      const res = await api.post('/stripe/create-checkout')
      window.location.href = res.data.url
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to open checkout. Make sure Stripe is configured in backend/.env')
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      {/* Top bar */}
      <header className="border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-display font-bold">CareerForge Pro</span>
        </div>
        <div className="flex items-center gap-4">
          {user?.plan === 'free' && (
            <button onClick={handleUpgrade} className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full transition-all">
              <Crown size={12} /> Upgrade to Pro
            </button>
          )}
          {user?.plan === 'pro' && (
            <span className="flex items-center gap-1.5 bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Crown size={12} /> Pro
            </span>
          )}
          <span className="text-white/50 text-sm">{user?.name}</span>
          <button onClick={handleLogout} className="text-white/40 hover:text-white/70 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl mb-1">My Resumes</h1>
            <p className="text-white/50 text-sm">
              {user?.plan === 'free' ? `Free plan: ${resumes.length}/1 resume used` : 'Pro plan: unlimited resumes'}
            </p>
          </div>
          <button onClick={handleNew} className="btn-primary">
            <Plus size={16} /> New Resume
          </button>
        </div>

        {/* Upgrade banner for free users */}
        {user?.plan === 'free' && (
          <div className="card p-5 mb-6 border-amber-500/20 bg-amber-500/5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-amber-400 text-sm mb-1">Unlock Pro Features</p>
              <p className="text-white/50 text-xs">Unlimited resumes · AI cover letters · Premium templates</p>
            </div>
            <button onClick={handleUpgrade} className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm px-4 py-2 rounded-lg transition-all">
              <Crown size={14} /> Upgrade — $19/mo
            </button>
          </div>
        )}

        {/* Resume grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="skeleton h-40 rounded-xl" />)}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20 card">
            <FileText size={48} className="text-white/20 mx-auto mb-4" />
            <h3 className="font-display font-bold text-xl mb-2">No resumes yet</h3>
            <p className="text-white/50 text-sm mb-6">Create your first ATS-optimized resume</p>
            <button onClick={handleNew} className="btn-primary mx-auto">
              <Plus size={16} /> Create Resume
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {resumes.map(resume => (
              <div key={resume.id} className="card p-5 hover:border-white/20 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <FileText size={20} className="text-brand-500" />
                  {resume.atsScore > 0 && (
                    <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${resume.atsScore >= 70 ? 'bg-emerald-500/10 text-emerald-400' : resume.atsScore >= 40 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                      <TrendingUp size={10} /> {resume.atsScore}%
                    </span>
                  )}
                </div>
                <h3 className="font-semibold mb-1 truncate">{resume.title}</h3>
                <p className="text-white/40 text-xs mb-4">
                  Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(resume)} className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-sm py-1.5 rounded-lg transition-all">
                    <Edit3 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(resume.id)} disabled={deletingId === resume.id} className="flex items-center justify-center w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}

            {/* Add new card */}
            {(user?.plan === 'pro' || resumes.length === 0) && (
              <button onClick={handleNew} className="card p-5 border-dashed border-white/10 hover:border-white/25 flex flex-col items-center justify-center gap-3 text-white/40 hover:text-white/70 transition-all h-40">
                <Plus size={28} />
                <span className="text-sm font-medium">New Resume</span>
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
