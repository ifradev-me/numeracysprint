import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import DiagnosticPage from './pages/DiagnosticPage'
import MicrolearningPage from './pages/MicrolearningPage'
import ExercisePage from './pages/ExercisePage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminPage from './pages/admin/AdminPage'
import AdminUsers from './pages/admin/AdminUsers'
import AdminMaterials from './pages/admin/AdminMaterials'
import AdminExercises from './pages/admin/AdminExercises'
import AdminTeam from './pages/admin/AdminTeam'
import ProtectedRoute from './components/ProtectedRoute'
import BottomNav from './components/BottomNav'

// Pages that should show the mobile bottom nav
const BOTTOM_NAV_ROUTES = ['/dashboard', '/diagnostic', '/microlearning', '/exercise', '/about']

function AppShell() {
  const { pathname } = useLocation()
  const showBottomNav = BOTTOM_NAV_ROUTES.includes(pathname)

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diagnostic"
          element={
            <ProtectedRoute>
              <DiagnosticPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/microlearning"
          element={
            <ProtectedRoute>
              <MicrolearningPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercise"
          element={
            <ProtectedRoute>
              <ExercisePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/materials" element={<AdminMaterials />} />
        <Route path="/admin/exercises" element={<AdminExercises />} />
        <Route path="/admin/team" element={<AdminTeam />} />
        {/* 404 Route */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Mobile bottom navigation — only on authenticated student pages */}
      {showBottomNav && <BottomNav />}
    </>
  )
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
