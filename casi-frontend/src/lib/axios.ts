import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

// Part 11: base URL should point at the Spring Boot backend. Configurable via
// .env so it's easy to swap between local dev and a deployed backend later.
const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the in-memory token to every outgoing request. Reading via getState()
// here (rather than a React hook) is the correct pattern outside components.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// A 401 means the token is invalid/expired — clear auth state so protected
// routes redirect to /login rather than silently failing repeated requests.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)
