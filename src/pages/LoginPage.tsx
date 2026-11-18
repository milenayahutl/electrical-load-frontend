
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store/store'
import { loginSuccess } from '../store/authSlice'
import { loginUser } from '../api/authApi'

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await loginUser({ login, password })

      localStorage.setItem('access_token', response.access_token)

      dispatch(loginSuccess(response.access_token))

      navigate('/')
    } catch {
      setError('Не удалось войти. Проверьте логин и пароль.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="catalog-page">
      <h1 className="screen-title">Вход</h1>

      <form onSubmit={handleSubmit}>
        <label className="form-label">
          Логин
          <input
            className="form-input"
            type="text"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            required
            disabled={loading}
          />
        </label>

        <label className="form-label">
          Пароль
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={loading}
          />
        </label>

        {error && <p className="text-danger">{error}</p>}

        <button
          type="submit"
          className="form-button"
          disabled={loading}
        >
          {loading ? 'Выполняется вход...' : 'Войти'}
        </button>
      </form>
    </main>
  )
}
