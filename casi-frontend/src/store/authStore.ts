import { create } from 'zustand'
import { api } from '@/lib/axios'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  UserSummary,
} from '@/types/auth'

interface AuthState {
  token: string | null
  user: UserSummary | null
  isLoading: boolean
  error: string | null
  login: (request: LoginRequest) => Promise<void>
  register: (request: RegisterRequest) => Promise<void>
  logout: () => void
  clearError: () => void
}

// Part 15/Sprint 3 exit criteria: "token persists in memory for the session."
// Deliberately NOT using zustand's persist middleware here — no localStorage,
// so a page refresh clears the session and the user has to log in again.
// That's the intentional MVP behavior, not an oversight; revisit only if the
// blueprint's security stance on token storage changes.
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: false,
  error: null,

  login: async (request) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.post<AuthResponse>('/api/auth/login', request)
      set({ token: data.token, user: data.user, isLoading: false })
    } catch (err) {
      set({
        isLoading: false,
        error: extractErrorMessage(err, 'Invalid email or password'),
      })
      throw err
    }
  },

  register: async (request) => {
    set({ isLoading: true, error: null })
    try {
      const { data } = await api.post<RegisterResponse>('/api/auth/register', request)
      set({
        token: data.token,
        user: { id: data.id, name: data.name },
        isLoading: false,
      })
    } catch (err) {
      set({
        isLoading: false,
        error: extractErrorMessage(err, 'Could not create account'),
      })
      throw err
    }
  },

  logout: () => set({ token: null, user: null, error: null }),

  clearError: () => set({ error: null }),
}))

function extractErrorMessage(err: unknown, fallback: string): string {
  if (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
  ) {
    return (err as { response: { data: { message: string } } }).response.data.message
  }
  return fallback
}
