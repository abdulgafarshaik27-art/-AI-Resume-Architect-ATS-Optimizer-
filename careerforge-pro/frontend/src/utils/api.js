import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api',
  timeout: 60000, // 60s for AI calls
})

// Attach token from localStorage if present on startup
const stored = JSON.parse(localStorage.getItem('careerforge-auth') || '{}')
if (stored?.state?.token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${stored.state.token}`
}

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('careerforge-auth')
      delete api.defaults.headers.common['Authorization']
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
