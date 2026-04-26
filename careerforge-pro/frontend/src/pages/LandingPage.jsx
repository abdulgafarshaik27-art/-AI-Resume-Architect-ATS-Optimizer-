import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Target, FileText, Star, ChevronRight, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">CareerForge Pro</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/pricing" className="text-white/60 hover:text-white text-sm transition-colors">Pricing</Link>
          <Link to="/login" className="text-white/60 hover:text-white text-sm transition-colors">Login</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center pt-24 pb-16 px-8 relative">
        <div className="absolute inset-0 bg-gradient-radial from-brand-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          <Star size={12} /> ATS-Optimized Resume Builder
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-4xl mx-auto">
          Get Past the Bots.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-accent">Land the Interview.</span>
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          AI rewrites your resume bullets to perfectly match any job description — boosting your ATS score and getting you noticed by recruiters.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="btn-primary text-base py-3 px-8 ai-glow">
            Build My Resume Free <ChevronRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary text-base py-3 px-8">
            Sign In
          </Link>
        </div>
        <p className="text-white/30 text-sm mt-5">No credit card required · Free plan included</p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 py-16 grid md:grid-cols-3 gap-6">
        {[
          { icon: Target, color: 'text-brand-500', title: 'JD Keyword Analysis', desc: 'AI extracts and ranks critical keywords from any job description — hard skills, tools, and must-haves.' },
          { icon: Zap, color: 'text-accent', title: 'AI Bullet Rewriter', desc: 'One click rewrites every bullet point with powerful action verbs and job-matched keywords.' },
          { icon: FileText, color: 'text-emerald-400', title: 'PDF Export', desc: 'Pixel-perfect PDF generated with headless Chrome — professional, ATS-readable, every time.' },
        ].map(({ icon: Icon, color, title, desc }) => (
          <div key={title} className="card p-6 hover:border-white/20 transition-all">
            <Icon size={28} className={`${color} mb-4`} />
            <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* ATS Score visual */}
      <section className="max-w-5xl mx-auto px-8 py-8 pb-20">
        <div className="card p-8 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="font-display font-bold text-3xl mb-4">Real-Time ATS Score</h2>
            <p className="text-white/60 mb-6 leading-relaxed">See exactly how well your resume matches any job posting. Our scoring engine analyzes keyword density, missing must-haves, and gives you a clear percentage match — before you apply.</p>
            <ul className="space-y-2">
              {['Must-have keyword detection', 'Weighted skill matching', 'Missing keyword alerts', 'Instant score after AI rewrite'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                  <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex items-center justify-center">
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
              <circle cx="90" cy="90" r="70" fill="none" stroke="url(#scoreGrad)" strokeWidth="14"
                strokeLinecap="round" strokeDasharray="440" strokeDashoffset="88"
                transform="rotate(-90 90 90)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#e94560" />
                </linearGradient>
              </defs>
              <text x="90" y="84" textAnchor="middle" fill="white" fontSize="36" fontFamily="Syne" fontWeight="800">80</text>
              <text x="90" y="106" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="13" fontFamily="DM Sans">ATS Score</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-white/30 text-sm">
        © {new Date().getFullYear()} CareerForge Pro · Built with AI
      </footer>
    </div>
  )
}
