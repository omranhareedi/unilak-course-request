import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const statusStyles = {
  waiting: 'bg-yellow-100 text-yellow-800',
  called: 'bg-blue-50 text-unilak-navy',
  serving: 'bg-green-50 text-unilak-green',
};

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState([]);
  const [serving, setServing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [showTransfer, setShowTransfer] = useState(null);
  const [depts, setDepts] = useState([]);
  const [services, setServices] = useState([]);
  const [transferForm, setTransferForm] = useState({ deptId: '', serviceId: '' });
  const socketRef = useRef(null);

  const token = localStorage.getItem('staffToken');
  const staffName = localStorage.getItem('staffName');

  useEffect(() => {
    if (!token) { navigate('/staff/login'); return; }
    socketRef.current = io('http://localhost:5000');
    return () => socketRef.current?.disconnect();
  }, [token, navigate]);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch('/api/queue/staff/queue', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.removeItem('staffToken'); navigate('/staff/login'); return; }
      const data = await res.json();
      setWaiting(data.waiting || []);
      setServing(data.serving || null);
      setLoading(false);
    } catch { setLoading(false); }
  }, [token, navigate]);

  useEffect(() => { if (token) fetchQueue(); }, [token, fetchQueue]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.on('queue-update', () => fetchQueue());
    return () => socket.off('queue-update');
  }, [fetchQueue]);

  const doAction = async (url, id = null) => {
    setActionId(id || 'call-next');
    try {
      const endpoint = id ? `/api/queue/staff/${id}${url}` : `/api/queue/staff${url}`;
      const res = await fetch(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { const d = await res.json(); alert(d.error); }
      await fetchQueue();
    } catch { alert('Network error'); } finally { setActionId(null); }
  };

  const handleTransfer = async (tokenId) => {
    if (!transferForm.deptId || !transferForm.serviceId) return;
    setActionId(tokenId);
    try {
      const res = await fetch(`/api/queue/staff/${tokenId}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(transferForm),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error); }
      setShowTransfer(null);
      setTransferForm({ deptId: '', serviceId: '' });
      await fetchQueue();
    } catch { alert('Network error'); } finally { setActionId(null); }
  };

  const loadDepts = async (campusId) => {
    const res = await fetch(`/api/queue/departments/${campusId}`);
    setDepts(await res.json());
  };
  const loadServices = async (deptId) => {
    const res = await fetch(`/api/queue/services/${deptId}`);
    setServices(await res.json());
  };

  const handleLogout = () => {
    localStorage.removeItem('staffToken');
    localStorage.removeItem('staffName');
    navigate('/staff/login');
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-unilak-navy to-unilak-green text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Staff Queue Dashboard</h1>
            <p className="text-gray-200 text-xs">{staffName}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center"><div className="text-2xl font-bold">{waiting.length}</div><div className="text-xs text-gray-200">Waiting</div></div>
            <div className="text-center"><div className="text-2xl font-bold">{serving ? 1 : 0}</div><div className="text-xs text-gray-200">Serving</div></div>
            <button onClick={handleLogout} className="text-xs text-gray-200 hover:text-white underline">Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Call Next button */}
        <div className="mb-6">
          <button onClick={() => doAction('/call-next')} disabled={actionId === 'call-next' || waiting.length === 0}
            className="bg-unilak-green text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-700
              disabled:opacity-50 transition-all shadow-lg shadow-green-200 w-full sm:w-auto">
            {actionId === 'call-next' ? 'Calling...' : `Call Next ${waiting.length > 0 ? `(${waiting[0].fullToken})` : ''}`}
          </button>
        </div>

        {/* Currently serving */}
        {serving && (
          <div className="card border-l-4 border-purple-500 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Currently Serving</p>
                <div className="text-3xl font-bold text-purple-700">{serving.fullToken}</div>
                <p className="text-sm text-gray-500">{serving.studentReg} — {serving.service_name}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => doAction(`/${serving._id}/complete`, serving._id)}
                  disabled={actionId === serving._id}
                  className="btn-success text-sm">Complete</button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : waiting.length === 0 && !serving ? (
          <div className="text-center py-12 text-gray-400">No students in queue</div>
        ) : (
          <div className="space-y-3">
            {waiting.map(t => (
              <div key={t._id} className={`card flex flex-col sm:flex-row sm:items-center justify-between gap-3
                ${t.status === 'called' ? 'border-l-4 border-blue-400 bg-blue-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-unilak-navy">{t.fullToken}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyles[t.status] || 'bg-gray-100'}`}>
                      {t.status}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t.studentReg}</p>
                    <p className="text-xs text-gray-400">{t.service_name}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {t.status === 'called' && (
                    <button onClick={() => doAction(`/${t._id}/start-serving`, t._id)}
                      disabled={actionId === t._id}
                      className="bg-unilak-green text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 disabled:opacity-50">
                      Start Serving
                    </button>
                  )}
                  {t.status === 'waiting' && (
                    <button onClick={() => doAction(`/${t._id}/recall`, t._id)}
                      disabled={actionId === t._id}
                      className="bg-unilak-navy text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-900 disabled:opacity-50">
                      Recall
                    </button>
                  )}
                  <button onClick={() => doAction(`/${t._id}/skip`, t._id)}
                    disabled={actionId === t._id}
                    className="bg-unilak-gold text-unilak-navy px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-yellow-400 disabled:opacity-50">
                    Skip
                  </button>
                  <button onClick={() => doAction(`/${t._id}/no-show`, t._id)}
                    disabled={actionId === t._id}
                    className="bg-gray-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-600 disabled:opacity-50">
                    No Show
                  </button>
                  <button onClick={() => {
                    setShowTransfer(t._id);
                    loadDepts(t.campusId || 'all');
                  }}
                    className="border border-unilak-navy text-unilak-navy px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50">
                    Transfer
                  </button>
                </div>

                {showTransfer === t._id && (
                  <div className="w-full bg-gray-50 p-4 rounded-lg mt-2">
                    <p className="text-xs font-medium text-gray-600 mb-3">Transfer to:</p>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <select value={transferForm.deptId} onChange={e => { setTransferForm(f => ({ ...f, deptId: e.target.value, serviceId: '' })); loadServices(e.target.value); }}
                        className="input-field text-sm">
                        <option value="">Select department</option>
                        {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                      <select value={transferForm.serviceId} onChange={e => setTransferForm(f => ({ ...f, serviceId: e.target.value }))}
                        className="input-field text-sm" disabled={!transferForm.deptId}>
                        <option value="">Select service</option>
                        {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <button onClick={() => handleTransfer(t._id)} disabled={!transferForm.serviceId || actionId === t._id}
                        className="bg-unilak-navy text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                        Transfer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
