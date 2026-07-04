import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
  }, [token, navigate]);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch(`/api/applications/all?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin');
        return;
      }
      const data = await res.json();
      setApplications(data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [filter, token, navigate]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => d.email && setAdminEmail(d.email))
      .catch(() => {});
  }, [token]);

  const handleReview = async (id, status) => {
    try {
      const res = await fetch(`/api/applications/${id}/review`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status } : a))
        );
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch {
      alert('Error updating application');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const pendingCount = applications.filter((a) => a.status === 'pending').length;

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-unilak-navy text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Department Dashboard</h1>
              <p className="text-gray-300 text-sm mt-1">{adminEmail && `Logged in as ${adminEmail}`}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{pendingCount}</div>
                <div className="text-xs text-gray-300">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{applications.length}</div>
                <div className="text-xs text-gray-300">Total</div>
              </div>
              <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-white ml-4 underline">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {['all', 'pending', 'accepted', 'rejected', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                filter === s
                  ? 'bg-unilak-navy text-white border-unilak-navy'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No applications found</p>
            <p className="text-sm mt-1">Applications submitted by students will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="card">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-unilak-navy">{app.fullName}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        app.status === 'accepted' ? 'bg-green-100 text-green-800 border-green-200' :
                        app.status === 'cancelled' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-2 text-sm text-gray-500 mb-3">
                      <span>Reg: {app.registrationNumber}</span>
                      <span>Email: {app.email}</span>
                      <span>Dept: {app.department}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 rounded-lg p-3">
                      {app.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Submitted {new Date(app.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {app.status === 'pending' && (
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleReview(app._id, 'accepted')}
                        className="btn-success text-sm px-4 py-2"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReview(app._id, 'rejected')}
                        className="btn-danger text-sm px-4 py-2"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
