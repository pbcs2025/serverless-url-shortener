import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiLink, FiBarChart2, FiSun, FiMoon, FiHome } from 'react-icons/fi';
import { useTheme } from '../App';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar__inner">

        {/* Logo */}
        <NavLink to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <FiLink />
          </div>
          <div className="navbar__logo-text">
            Swift<span>Link</span>
          </div>
        </NavLink>

        {/* Navigation Links */}
        <div className="navbar__links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
          >
            <FiHome size={15} />
            <span>Shorten</span>
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `navbar__link${isActive ? ' navbar__link--active' : ''}`
            }
          >
            <FiBarChart2 size={15} />
            <span>Analytics</span>
          </NavLink>
        </div>

        {/* Controls */}
        <div className="navbar__controls">
          <div className="navbar__badge">
            <div className="navbar__badge-dot" />
            AWS Live
          </div>
          <button
            className="navbar__theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <FiMoon size={16} /> : <FiSun size={16} />}
          </button>
        </div>

      </div>
    </nav>
  );
}