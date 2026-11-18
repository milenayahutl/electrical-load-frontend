
import { Api } from './generated/ElectricityConsumersApi'

export const electricityConsumersApi = new Api({
  baseURL: '/api',

  securityWorker: () => {
    const token = localStorage.getItem('access_token')

    return token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {}
  },
})
