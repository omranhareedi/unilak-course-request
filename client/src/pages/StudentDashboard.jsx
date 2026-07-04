import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UnilakLogo from '../components/UnilakLogo';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  accepted: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const token = localStorage.getItem('studentToken');
  const reg = localStorage.getItem('studentReg');

  useEffect(() => {
    if (!token) {
      navigate('/student/login');
    }
  }, [token, navigate]);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch('/api/students/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentReg');
        navigate('/student/login');
        return;
      }
      const data = await res.json();
      setApplications(data);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) fetchApplications();
  }, [token, fetchApplications]);

  const handleCancel = async (id) => {
    setCancelling(id);
    try {
      const res = await fetch(`/api/students/applications/${id}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status: 'cancelled' } : a))
        );
      } else {
        alert(data.error);
      }
    } catch {
      alert('Network error');
    } finally {
      setCancelling(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentReg');
    navigate('/student/login');
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-unilak-navy to-unilak-green text-white">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Requests</h1>
              <p className="text-gray-200 text-sm mt-1">Registration: {reg}</p>
            </div>
            <button onClick={handleLogout} className="text-sm text-gray-200 hover:text-white underline">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No requests found</p>
            <Link to="/apply" className="text-unilak-green font-medium hover:underline mt-2 inline-block">
              Submit a request
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-unilak-navy">{app.department}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyles[app.status] || statusStyles.pending}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">{app.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      {app.adminNote && <span className="italic">Note: {app.adminNote}</span>}
                    </div>
                  </div>
                  {app.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(app._id)}
                      disabled={cancelling === app._id}
                      className="ml-4 shrink-0 text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50 px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      {cancelling === app._id ? 'Cancelling...' : 'Cancel'}
                    </button>
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
