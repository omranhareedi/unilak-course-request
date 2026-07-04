import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UnilakLogo from './UnilakLogo';

function getLinks(role) {
  const base = [
    { to: '/', label: 'Home' },
    { to: '/queue', label: 'Join Queue' },
    { to: '/queue/status', label: 'My Tokens' },
    { to: '/display', label: 'Live Display' },
  ];

  if (!role) return [...base, { to: '/login', label: 'Login', highlight: true }];

  if (role === 'student') return [...base, { to: '/student/dashboard', label: 'Dashboard' }, { to: '/apply', label: 'Submit Request' }];
  return [...base, { to: '/staff/dashboard', label: 'Queue' }, { to: '/staff/courses', label: 'Requests' }, { to: '/staff/analytics', label: 'Analytics' }];
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { role, user, isAuthenticated, logout } = useAuth();
  const links = getLinks(role);

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <UnilakLogo size={34} showText={false} />
            <span className="font-bold text-lg text-unilak-navy">UNILAK</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  l.highlight
                    ? 'bg-unilak-green text-white hover:bg-green-700'
                    : pathname === l.to
                      ? 'bg-unilak-navy text-white'
                      : 'text-gray-600 hover:text-unilak-navy hover:bg-gray-50'
                }`}
              >
                {l.label}
              </Link>
            ))}
            {isAuthenticated && (
              <div className="flex items-center gap-3 ml-3 pl-3 border-l border-gray-200">
                <span className="text-xs text-gray-400 capitalize">{role} — {user?.name || user?.email || ''}</span>
                <button onClick={handleLogout} className="text-xs text-red-600 hover:text-red-800 font-medium">
                  Logout
                </button>
              </div>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                  l.highlight
                    ? 'bg-unilak-green text-white'
                    : pathname === l.to
                      ? 'bg-unilak-navy text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {l.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg">
                Logout ({user?.name || user?.email || role})
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
