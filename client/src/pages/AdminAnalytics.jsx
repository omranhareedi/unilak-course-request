import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminAnalytics() {
  const { token } = useAuth();
  const [campuses, setCampuses] = useState([]);
  const [depts, setDepts] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [stats, setStats] = useState(null);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    fetch('/api/queue/campuses').then(r => r.json()).then(setCampuses);
  }, []);

  useEffect(() => {
    if (!selectedCampus) return;
    fetch(`/api/queue/departments/${selectedCampus}`).then(r => r.json()).then(setDepts);
  }, [selectedCampus]);

  const fetchStats = async () => {
    if (!selectedDept) return;
    const res = await fetch(`/api/queue/display/stats/${selectedDept}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStats(data);

    // also get all tokens for today
    const res2 = await fetch(`/api/queue/staff/queue`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const q = await res2.json();
    setTokens([...(q.waiting || []), ...(q.serving ? [q.serving] : [])]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-unilak-navy mb-6">Admin Analytics</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <select value={selectedCampus} onChange={e => { setSelectedCampus(e.target.value); setSelectedDept(''); }}
          className="input-field">
          <option value="">Select campus</option>
          {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} className="input-field" disabled={!selectedCampus}>
          <option value="">Select department</option>
          {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <button onClick={fetchStats} disabled={!selectedDept} className="btn-primary">Load Stats</button>
      </div>

      {stats && (
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <div className="card text-center"><div className="text-3xl font-bold text-unilak-navy">{stats.total}</div><div className="text-sm text-gray-500">Total Today</div></div>
          <div className="card text-center"><div className="text-3xl font-bold text-unilak-green">{stats.served}</div><div className="text-sm text-gray-500">Served Today</div></div>
          <div className="card text-center"><div className="text-3xl font-bold text-unilak-gold">{stats.avgServiceSec > 0 ? `${Math.round(stats.avgServiceSec / 60)}m` : '—'}</div><div className="text-sm text-gray-500">Avg Service Time</div></div>
        </div>
      )}

      {tokens.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-unilak-navy mb-4">Active Tokens</h2>
          <div className="space-y-2">
            {tokens.map(t => (
              <div key={t._id} className="card flex justify-between items-center py-3">
                <span className="font-bold">{t.fullToken}</span>
                <span className="text-sm text-gray-500">{t.studentReg}</span>
                <span className="text-xs text-gray-400">{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
