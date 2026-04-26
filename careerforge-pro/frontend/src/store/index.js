import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../utils/api'

// ─── AUTH SLICE ───────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const res = await api.post('/auth/login', { email, password })
          set({ user: res.data.user, token: res.data.token, isLoading: false })
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
          return { success: true }
        } catch (err) {
          const msg = err.response?.data?.error || 'Login failed'
          set({ error: msg, isLoading: false })
          return { success: false, error: msg }
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null })
        try {
          const res = await api.post('/auth/register', { name, email, password })
          set({ user: res.data.user, token: res.data.token, isLoading: false })
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
          return { success: true }
        } catch (err) {
          const msg = err.response?.data?.error || 'Registration failed'
          set({ error: msg, isLoading: false })
          return { success: false, error: msg }
        }
      },

      logout: () => {
        set({ user: null, token: null })
        delete api.defaults.headers.common['Authorization']
      },

      refreshUser: async () => {
        try {
          const res = await api.get('/auth/me')
          set({ user: res.data })
        } catch {}
      },
    }),
    {
      name: 'careerforge-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
        }
      },
    }
  )
)

// ─── RESUME EDITOR SLICE ──────────────────────────────────────────────
export const useResumeStore = create((set, get) => ({
  // Current resume being edited
  resumeId: null,
  resumeTitle: 'My Resume',
  resumeData: getEmptyResumeData(),

  // JD & AI
  jobDescription: '',
  jdAnalysis: null,
  atsScore: null,
  atsDetails: null,
  isAnalyzingJD: false,
  isRewriting: false,

  // UI
  activeSection: 'personalInfo',
  selectedTemplate: 'modern',
  isSaving: false,
  lastSaved: null,

  // Actions
  setResumeData: (data) => set({ resumeData: data }),
  setJobDescription: (jd) => set({ jobDescription: jd }),
  setJdAnalysis: (analysis) => set({ jdAnalysis: analysis }),
  setAtsScore: (score, details) => set({ atsScore: score, atsDetails: details }),
  setActiveSection: (section) => set({ activeSection: section }),
  setTemplate: (template) => set({ selectedTemplate: template }),

  loadResume: (resume) => set({
    resumeId: resume.id,
    resumeTitle: resume.title,
    resumeData: resume.data,
    atsScore: resume.atsScore || null,
  }),

  resetEditor: () => set({
    resumeId: null,
    resumeTitle: 'My Resume',
    resumeData: getEmptyResumeData(),
    jobDescription: '',
    jdAnalysis: null,
    atsScore: null,
    atsDetails: null,
  }),

  updatePersonalInfo: (field, value) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        personalInfo: { ...state.resumeData.personalInfo, [field]: value },
      },
    })),

  updateExperience: (index, field, value) =>
    set((state) => {
      const exp = [...(state.resumeData.experience || [])]
      exp[index] = { ...exp[index], [field]: value }
      return { resumeData: { ...state.resumeData, experience: exp } }
    }),

  addExperience: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: [
          ...(state.resumeData.experience || []),
          { id: Date.now(), title: '', company: '', location: '', startDate: '', endDate: '', current: false, bullets: [''] },
        ],
      },
    })),

  removeExperience: (index) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: state.resumeData.experience.filter((_, i) => i !== index),
      },
    })),

  updateBullet: (expIndex, bulletIndex, value) =>
    set((state) => {
      const exp = [...(state.resumeData.experience || [])]
      const bullets = [...(exp[expIndex].bullets || [])]
      bullets[bulletIndex] = value
      exp[expIndex] = { ...exp[expIndex], bullets }
      return { resumeData: { ...state.resumeData, experience: exp } }
    }),

  addBullet: (expIndex) =>
    set((state) => {
      const exp = [...(state.resumeData.experience || [])]
      exp[expIndex] = { ...exp[expIndex], bullets: [...(exp[expIndex].bullets || []), ''] }
      return { resumeData: { ...state.resumeData, experience: exp } }
    }),

  removeBullet: (expIndex, bulletIndex) =>
    set((state) => {
      const exp = [...(state.resumeData.experience || [])]
      const bullets = exp[expIndex].bullets.filter((_, i) => i !== bulletIndex)
      exp[expIndex] = { ...exp[expIndex], bullets }
      return { resumeData: { ...state.resumeData, experience: exp } }
    }),

  updateEducation: (index, field, value) =>
    set((state) => {
      const edu = [...(state.resumeData.education || [])]
      edu[index] = { ...edu[index], [field]: value }
      return { resumeData: { ...state.resumeData, education: edu } }
    }),

  addEducation: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: [
          ...(state.resumeData.education || []),
          { id: Date.now(), degree: '', field: '', institution: '', graduationYear: '', gpa: '' },
        ],
      },
    })),

  removeEducation: (index) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.filter((_, i) => i !== index),
      },
    })),

  setSkills: (skills) =>
    set((state) => ({ resumeData: { ...state.resumeData, skills } })),

  updateProject: (index, field, value) =>
    set((state) => {
      const projects = [...(state.resumeData.projects || [])]
      projects[index] = { ...projects[index], [field]: value }
      return { resumeData: { ...state.resumeData, projects } }
    }),

  addProject: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: [
          ...(state.resumeData.projects || []),
          { id: Date.now(), name: '', description: '', technologies: [], url: '' },
        ],
      },
    })),

  removeProject: (index) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.filter((_, i) => i !== index),
      },
    })),

  saveResume: async () => {
    const state = get()
    set({ isSaving: true })
    try {
      const payload = { title: state.resumeTitle, data: state.resumeData, atsScore: state.atsScore }
      let res
      if (state.resumeId) {
        res = await api.put(`/resume/${state.resumeId}`, payload)
      } else {
        res = await api.post('/resume', payload)
        set({ resumeId: res.data.id })
      }
      set({ isSaving: false, lastSaved: new Date() })
      return { success: true }
    } catch (err) {
      set({ isSaving: false })
      return { success: false, error: err.response?.data?.error || 'Save failed', upgrade: err.response?.data?.upgrade }
    }
  },
}))

function getEmptyResumeData() {
  return {
    personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '', summary: '' },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  }
}
