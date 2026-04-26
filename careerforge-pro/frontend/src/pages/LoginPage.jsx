import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../store'

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl">CareerForge Pro</span>
          </Link>
          <h1 className="font-display font-bold text-3xl mb-2">{title}</h1>
          <p className="text-white/50 text-sm">{subtitle}</p>
        </div>
        <div className="card p-8">{children}</div>
      </div>
    </div>
  )
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const { login, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(email, password)
    if (result.success) navigate('/dashboard')
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your CareerForge account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center py-3">
          {isLoading ? 'Signing in…' : 'Sign In'}
        </button>
        <p className="text-center text-sm text-white/50">
          No account? <Link to="/register" className="text-brand-500 hover:text-brand-400">Create one free</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const { register, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await register(name, email, password)
    if (result.success) navigate('/dashboard')
  }

  return (
    <AuthLayout title="Start for free" subtitle="Create your CareerForge Pro account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}
        <div>
          <label className="label">Full Name</label>
          <input type="text" className="input" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label">Password <span className="text-white/30 normal-case font-normal">(min 6 characters)</span></label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center py-3 ai-glow">
          {isLoading ? 'Creating account…' : 'Create Free Account'}
        </button>
        <p className="text-center text-sm text-white/50">
          Already have an account? <Link to="/login" className="text-brand-500 hover:text-brand-400">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
