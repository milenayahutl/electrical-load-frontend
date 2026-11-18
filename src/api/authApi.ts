import axios from 'axios'

interface LoginRequest {
  login: string
  password: string
}

interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export const loginUser = async (credentials: LoginRequest) => {
  const response = await axios.post<LoginResponse>(
    '/api/auth/login',
    credentials
  )

  return response.data
}

export const logoutUser = async (token: string) => {
  await axios.post(
    '/api/auth/logout',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}
