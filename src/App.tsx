
import { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useNavigate,
} from 'react-router-dom'

import { Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store/store'

import FeedPage from './pages/FeedPage'
import CatalogPage from './pages/CatalogPage'
import LoginPage from './pages/LoginPage'
import AddElectricityConsumerPage from './pages/AddElectricityConsumerPage'

import { ELECTRICITY_CONSUMERS_MOCK } from './data/mock'
import { logout } from './store/authSlice'
import { resetFilter } from './store/filterSlice'
import { logoutUser } from './api/authApi'

import './App.css'

function BottomNav() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  )

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      if (!accessToken) {
        throw new Error('Токен отсутствует')
      }

      await logoutUser(accessToken)

      localStorage.removeItem('access_token')
      dispatch(logout())
      dispatch(resetFilter())

      navigate('/')
    } catch {
      alert('Не удалось выйти из системы.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="bottom-nav">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive ? 'active' : ''
        }
      >
        <span className="nav-icon">⌂</span>
        <span className="nav-text">Лента</span>
      </NavLink>

      {isAuthenticated ? (
        <NavLink
          to="/add"
          className={({ isActive }) =>
            isActive ? 'active' : ''
          }
        >
          <span className="nav-icon">＋</span>
          <span className="nav-text">Добавить</span>
        </NavLink>
      ) : (
        <span className="nav-disabled">
          <span className="nav-icon">＋</span>
          <span className="nav-text">Добавить</span>
        </span>
      )}

      <NavLink
        to="/catalog"
        className={({ isActive }) =>
          isActive ? 'active' : ''
        }
      >
        <span className="nav-icon">▦</span>
        <span className="nav-text">Каталог</span>
      </NavLink>

      {isAuthenticated ? (
        <button
          type="button"
          className="nav-logout"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <span className="nav-icon">⇥</span>
          <span className="nav-text">
            {isLoggingOut ? 'Выход...' : 'Выйти'}
          </span>
        </button>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive ? 'active' : ''
          }
        >
          <span className="nav-icon">⇥</span>
          <span className="nav-text">Войти</span>
        </NavLink>
      )}
    </nav>
  )
}

function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )

  const isLoading = useSelector((state: RootState) => {
    const data = state.electricityConsumers

    return (
      data.loading ||
      data.feedLoading ||
      data.likeLoading ||
      data.deleteLoading ||
      data.draftLoading ||
      data.createLoading ||
      data.publishLoading
    )
  })

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <div className="phone-shell">
          <Routes>
            <Route
              path="/"
              element={
                <FeedPage
                  consumers={ELECTRICITY_CONSUMERS_MOCK}
                />
              }
            />

            <Route
              path="/catalog"
              element={
                <CatalogPage
                  consumers={ELECTRICITY_CONSUMERS_MOCK}
                />
              }
            />

            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/add"
              element={
                isAuthenticated ? (
                  <AddElectricityConsumerPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>

          <BottomNav />

          {isLoading && (
            <div
              className="request-overlay"
              role="status"
              aria-live="polite"
            >
              <Spinner animation="border" />
              <span>Загрузка...</span>
            </div>
          )}
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
