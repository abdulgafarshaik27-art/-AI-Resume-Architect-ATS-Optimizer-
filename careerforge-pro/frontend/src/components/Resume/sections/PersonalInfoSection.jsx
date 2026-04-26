import React from 'react'
import { useResumeStore } from '../../../store'

export default function PersonalInfoSection() {
  const { resumeData, updatePersonalInfo } = useResumeStore()
  const info = resumeData.personalInfo || {}

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        className="input"
        placeholder={placeholder}
        value={info[key] || ''}
        onChange={e => updatePersonalInfo(key, e.target.value)}
      />
    </div>
  )

  return (
    <div className="space-y-3">
      <p className="section-heading">Personal Information</p>
      {field('Full Name', 'fullName', 'text', 'Jane Smith')}
      {field('Email', 'email', 'email', 'jane@example.com')}
      <div className="grid grid-cols-2 gap-3">
        {field('Phone', 'phone', 'tel', '+1 (555) 000-0000')}
        {field('Location', 'location', 'text', 'New York, NY')}
      </div>
      {field('LinkedIn URL', 'linkedin', 'text', 'linkedin.com/in/janesmith')}
      {field('Website / Portfolio', 'website', 'text', 'janesmith.dev')}
      <div>
        <label className="label">Professional Summary</label>
        <textarea
          className="input resize-none"
          rows={4}
          placeholder="Results-driven software engineer with 5+ years of experience..."
          value={info.summary || ''}
          onChange={e => updatePersonalInfo('summary', e.target.value)}
        />
        <p className="text-white/30 text-xs mt-1">Tip: The AI will rewrite this to match your target JD</p>
      </div>
    </div>
  )
}
