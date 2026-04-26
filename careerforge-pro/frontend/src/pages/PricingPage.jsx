import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, Zap, Crown, X } from 'lucide-react'
import { useAuthStore } from '../store'
import api from '../utils/api'

const FREE_FEATURES = [
  '1 Resume',
  'Live Preview',
  'AI Bullet Rewriter (3/day)',
  'ATS Score',
  'PDF Export (watermarked)',
]

const FREE_MISSING = [
  'Unlimited Resumes',
  'AI Cover Letters',
  'Premium Templates',
  'Unlimited AI Rewrites',
  'Clean PDF (no watermark)',
]

const PRO_FEATURES = [
  'Unlimited Resumes',
  'Full AI Bullet Rewriter',
  'ATS Score & Gap Analysis',
  'AI Cover Letter Generator',
  'Premium PDF Templates',
  'Clean PDF Export',
  'Dashboard & History',
  'Priority Support',
]

export default function PricingPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const handleUpgrade = async () => {
    if (!user) { navigate('/register'); return }
    try {
      const res = await api.post('/stripe/create-checkout')
      window.location.href = res.data.url
    } catch (err) {
      alert(err.response?.data?.error || 'Stripe not configured yet. Add your Stripe keys to backend/.env')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg">CareerForge Pro</span>
        </Link>
        <div className="flex gap-3">
          {user ? (
            <Link to="/dashboard" className="btn-secondary text-sm py-2">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm py-2">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2">Sign Up Free</Link>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-20 text-center">
        <h1 className="font-display font-bold text-5xl mb-4">Simple Pricing</h1>
        <p className="text-white/50 mb-14">Start free. Upgrade when you need more power.</p>

        <div className="grid md:grid-cols-2 gap-6 text-left">
          {/* Free */}
          <div className="card p-8">
            <div className="mb-6">
              <p className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-2">Free</p>
              <div className="text-5xl font-display font-bold">$0</div>
              <p className="text-white/40 text-sm mt-1">Forever free</p>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                  <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" /> {f}
                </li>
              ))}
              {FREE_MISSING.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/30">
                  <X size={15} className="flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/register" className="btn-secondary w-full justify-center py-3">Get Started Free</Link>
          </div>

          {/* Pro */}
          <div className="relative card p-8 border-brand-500/50 bg-brand-900/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full">
              <Crown size={12} /> Most Popular
            </div>
            <div className="mb-6">
              <p className="text-brand-400 text-sm font-semibold uppercase tracking-wider mb-2">Pro</p>
              <div className="text-5xl font-display font-bold">$19<span className="text-2xl text-white/40">/mo</span></div>
              <p className="text-white/40 text-sm mt-1">Cancel anytime</p>
            </div>
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/90">
                  <CheckCircle size={15} className="text-brand-400 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button onClick={handleUpgrade} className="btn-primary w-full justify-center py-3 ai-glow">
              <Crown size={16} /> Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
