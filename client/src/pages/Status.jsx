import { useState } from 'react';

const statusBadge = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  accepted: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

export default function Status() {
  const [reg, setReg] = useState('');
  const [applications, setApplications] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStatus = async (e) => {
    e.preventDefault();
    if (!reg.trim()) return;
    setLoading(true);
    setError('');
    setApplications(null);
    try {
      const res = await fetch(`/api/applications/status?reg=${encodeURIComponent(reg)}`);
      const data = await res.json();
      if (res.ok) {
        setApplications(data);
        if (data.length === 0) setError('No applications found for this registration number.');
      } else {
        setError(data.error);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-unilak-navy">Check Application Status</h1>
        <p className="text-gray-500 mt-2">Enter your registration number to see the status of your request.</p>
      </div>

      <form onSubmit={fetchStatus} className="card flex gap-3 mb-8">
        <input
          type="text"
          value={reg}
          onChange={(e) => setReg(e.target.value)}
          placeholder="Enter registration number..."
          className="input-field"
          required
        />
        <button type="submit" disabled={loading} className="btn-primary shrink-0">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm mb-6">
          {error}
        </div>
      )}

      {applications && applications.length > 0 && (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-unilak-navy text-lg">{app.department}</h3>
                  <p className="text-sm text-gray-500">{app.fullName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge[app.status] || statusBadge.pending}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">{app.message}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                {app.adminNote && (
                  <span className="text-gray-500 italic">Note: {app.adminNote}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
