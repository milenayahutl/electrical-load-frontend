
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom'
import FeedPage from './pages/FeedPage'
import { ELECTRICITY_CONSUMERS_MOCK } from './data/mock'
import './App.css'
import CatalogPage from './pages/CatalogPage'

function BottomNav() {
  return (
    <nav className="bottom-nav">

      <NavLink
        to="/"
        end
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        <span className="nav-icon">⌂</span>
        <span className="nav-text">Лента</span>
      </NavLink>

      <span className="nav-disabled">
        <span className="nav-icon">＋</span>
        <span className="nav-text">Добавить</span>
      </span>

      <NavLink
        to="/catalog"
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        <span className="nav-icon">▦</span>
        <span className="nav-text">Каталог</span>
      </NavLink>

      <span className="nav-disabled">
        <span className="nav-icon">⇥</span>
        <span className="nav-text">Войти</span>
      </span>

    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <div className="phone-shell">

          <Routes>
            <Route
              path="/"
              element={
                <FeedPage consumers={ELECTRICITY_CONSUMERS_MOCK} />
              }
            />

            <Route
              path="/catalog"
              element={
                <CatalogPage consumers={ELECTRICITY_CONSUMERS_MOCK} />
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <BottomNav />

        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
