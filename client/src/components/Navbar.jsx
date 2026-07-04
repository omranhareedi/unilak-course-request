import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/apply', label: 'Apply' },
  { to: '/status', label: 'Check Status' },
  { to: '/admin', label: 'Admin' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-unilak-navy to-unilak-green flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
            <span className="font-bold text-lg text-unilak-navy">UNILAK</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.to
                    ? 'bg-unilak-navy text-white'
                    : 'text-gray-600 hover:text-unilak-navy hover:bg-gray-50'
                }`}
              >
                {l.label}
              </Link>
            ))}
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
                  pathname === l.to
                    ? 'bg-unilak-navy text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
