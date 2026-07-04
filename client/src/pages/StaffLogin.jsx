import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UnilakLogo from '../components/UnilakLogo';

export default function StaffLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/queue/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('staffToken', data.token);
        localStorage.setItem('staffName', data.staff.name);
        navigate('/staff/dashboard');
      } else {
        setError(data.error);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4">
            <UnilakLogo size={60} showText={false} />
          </div>
          <h1 className="text-2xl font-bold text-unilak-navy">Staff Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your queue</p>
          <p className="text-xs text-gray-400 mt-1">Demo: alice@unilak.ac.rw / staff123</p>
        </div>
        <form onSubmit={handleLogin} className="card space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="staff@unilak.ac.rw" className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter password" className="input-field" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
