import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UnilakLogo from '../components/UnilakLogo';

const roles = [
  { key: 'student', label: 'Student', desc: 'Track your queue tokens' },
  { key: 'staff', label: 'Staff', desc: 'Queue management, requests &amp; analytics' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ registrationNumber: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await login(form, tab);
      navigate(result.redirect);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4">
            <UnilakLogo size={60} showText={false} />
          </div>
          <h1 className="text-2xl font-bold text-unilak-navy">Welcome to UNILAK</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to access your dashboard</p>
        </div>

        {/* Role tabs */}
        <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-6">
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => { setTab(r.key); setError(''); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === r.key
                  ? 'bg-unilak-navy text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{error}</div>
          )}

          {tab === 'student' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Registration Number</label>
                <input
                  type="text"
                  value={form.registrationNumber}
                  onChange={(e) => setForm(f => ({ ...f, registrationNumber: e.target.value }))}
                  placeholder="e.g. 2024/CS/001"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@unilak.ac.rw"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="input-field"
                  required
                />
              </div>
            </>
          )}

          {tab === 'staff' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="staff@unilak.ac.rw"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter password"
                  className="input-field"
                  required
                />
              </div>
              <p className="text-xs text-gray-400">Demo: alice@unilak.ac.rw / staff123</p>
            </>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        {tab === 'student' && (
          <p className="text-center text-sm text-gray-400 mt-4">
            No account?{' '}
            <a href="/signup" className="text-unilak-green font-medium hover:underline">Sign up</a>
          </p>
        )}
      </div>
    </div>
  );
}
