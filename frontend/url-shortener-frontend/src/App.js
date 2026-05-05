import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './auth/AuthContext';
import RequireAuth from './auth/RequireAuth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';

// ── Theme Context ──────────────────────────────────────────────
export const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

// ── App Root ───────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('swiftlink-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('swiftlink-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthProvider>
        <Router>
          <div className="app-layout">
            <Navbar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/stats/:shortCode" element={<StatsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <DashboardPage />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeContext.Provider>
  );
}