// Matches Part 11 API spec exactly — RegisterResponse and AuthResponse are
// genuinely different shapes (per Sprint 1's key decision), not one shared DTO.

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterResponse {
  id: string
  name: string
  email: string
  token: string
}

export interface UserSummary {
  id: string
  name: string
}

export interface AuthResponse {
  token: string
  user: UserSummary
}

export interface ApiErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}
