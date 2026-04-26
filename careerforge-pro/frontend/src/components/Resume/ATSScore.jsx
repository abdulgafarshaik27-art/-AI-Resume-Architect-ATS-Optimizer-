import React from 'react'
import { TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import { useResumeStore } from '../../store'

export default function ATSScore() {
  const { atsScore, atsDetails } = useResumeStore()
  if (atsScore === null) return null

  const radius = 52
  const circ = 2 * Math.PI * radius
  const offset = circ - (atsScore / 100) * circ

  const scoreColor = atsScore >= 70 ? '#10b981' : atsScore >= 40 ? '#f59e0b' : '#ef4444'
  const scoreLabel = atsScore >= 70 ? 'Great Match!' : atsScore >= 40 ? 'Needs Work' : 'Low Match'

  return (
    <div className="mx-4 mb-4 card p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={15} className="text-brand-400" />
        <span className="section-heading mb-0 border-none pb-0">ATS Match Score</span>
      </div>

      <div className="flex items-center gap-6 mb-4">
        {/* Circular score */}
        <div className="relative flex-shrink-0">
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
            <circle
              cx="65" cy="65" r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              transform="rotate(-90 65 65)"
              style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
            />
            <text x="65" y="58" textAnchor="middle" fill="white" fontSize="26" fontFamily="Syne" fontWeight="800">{atsScore}</text>
            <text x="65" y="74" textAnchor="middle" fill={scoreColor} fontSize="9" fontFamily="DM Sans" fontWeight="600">%</text>
            <text x="65" y="88" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8.5" fontFamily="DM Sans">{scoreLabel}</text>
          </svg>
        </div>

        {/* Summary */}
        <div className="flex-1">
          <p className="text-sm font-semibold mb-1" style={{ color: scoreColor }}>{scoreLabel}</p>
          <p className="text-white/50 text-xs leading-relaxed">
            {atsDetails?.matchedCount || 0} of {atsDetails?.totalKeywords || 0} keywords matched
          </p>
          {atsScore < 70 && (
            <p className="text-white/40 text-xs mt-2 leading-relaxed">
              Use the AI rewrite to boost your score above 70% and pass ATS filters.
            </p>
          )}
        </div>
      </div>

      {/* Matched keywords */}
      {atsDetails?.matched?.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle size={12} className="text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">Matched ({atsDetails.matched.length})</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {atsDetails.matched.map(kw => (
              <span key={kw} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {/* Missing keywords */}
      {atsDetails?.missing?.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <AlertCircle size={12} className="text-red-400" />
            <span className="text-xs font-semibold text-red-400">Missing ({atsDetails.missing.length})</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {atsDetails.missing.map(kw => (
              <span key={kw} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">{kw}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
