import { useState } from 'react';
import { Link } from 'react-router-dom';

const statusStyles = {
  waiting: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  called: 'bg-blue-100 text-blue-800 border-blue-200',
  serving: 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  skipped: 'bg-red-100 text-red-800 border-red-200',
  no_show: 'bg-gray-100 text-gray-600 border-gray-200',
  transferred: 'bg-orange-100 text-orange-800 border-orange-200',
};

export default function QueueStatus() {
  const [reg, setReg] = useState('');
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTokens = async (e) => {
    e.preventDefault();
    if (!reg.trim()) return;
    setLoading(true);
    setError('');
    setTokens(null);
    try {
      const res = await fetch(`/api/queue/status?reg=${encodeURIComponent(reg)}`);
      const data = await res.json();
      if (res.ok) {
        setTokens(data);
        if (data.length === 0) setError('No tokens found for this registration number.');
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
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-unilak-navy">My Queue Tokens</h1>
        <p className="text-gray-500 mt-2">Enter your registration number to see all your queue tokens.</p>
      </div>

      <form onSubmit={fetchTokens} className="card flex gap-3 mb-8">
        <input type="text" value={reg} onChange={e => setReg(e.target.value)}
          placeholder="Enter registration number..." className="input-field" required />
        <button type="submit" disabled={loading} className="btn-primary shrink-0">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm mb-6">{error}</div>
      )}

      {tokens && tokens.length > 0 && (
        <div className="space-y-4">
          {tokens.map(t => (
            <div key={t._id || t.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-2xl font-bold text-unilak-navy">{t.full_token}</div>
                  <p className="text-sm text-gray-500">{t.service_name || t.serviceName} — {t.department_name || t.departmentName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[t.status] || statusStyles.waiting}`}>
                  {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                </span>
              </div>
              <p className="text-xs text-gray-400">{t.campus_name || t.campusName}</p>
            </div>
          ))}
          <p className="text-center mt-6">
            <Link to="/queue" className="text-unilak-green font-medium hover:underline">Join a new queue</Link>
          </p>
        </div>
      )}
    </div>
  );
}
