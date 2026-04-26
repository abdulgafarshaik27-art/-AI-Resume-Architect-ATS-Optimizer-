import React from 'react'
import { User, Briefcase, GraduationCap, Code, FolderGit2, Award } from 'lucide-react'
import { useResumeStore } from '../../store'
import PersonalInfoSection from './sections/PersonalInfoSection'
import ExperienceSection from './sections/ExperienceSection'
import EducationSection from './sections/EducationSection'
import SkillsSection from './sections/SkillsSection'
import ProjectsSection from './sections/ProjectsSection'
import CertificationsSection from './sections/CertificationsSection'

const SECTIONS = [
  { id: 'personalInfo', label: 'Info', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'certs', label: 'Certs', icon: Award },
]

export default function ResumeForm() {
  const { activeSection, setActiveSection } = useResumeStore()

  return (
    <div className="flex flex-col h-full">
      {/* Section tabs */}
      <div className="flex border-b border-white/5 overflow-x-auto flex-shrink-0 bg-[#0f0f1a]">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`flex flex-col items-center gap-1 px-4 py-2.5 text-xs font-medium transition-colors flex-shrink-0 ${activeSection === id ? 'text-white border-b-2 border-brand-500 bg-white/5' : 'text-white/40 hover:text-white/70'}`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Section content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeSection === 'personalInfo' && <PersonalInfoSection />}
        {activeSection === 'experience' && <ExperienceSection />}
        {activeSection === 'education' && <EducationSection />}
        {activeSection === 'skills' && <SkillsSection />}
        {activeSection === 'projects' && <ProjectsSection />}
        {activeSection === 'certs' && <CertificationsSection />}
      </div>
    </div>
  )
}
