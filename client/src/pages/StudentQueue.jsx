import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const steps = ['Campus', 'Department', 'Service', 'Details', 'Queue'];

export default function StudentQueue() {
  const [step, setStep] = useState(0);
  const [campuses, setCampuses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState({ campus: null, dept: null, service: null });
  const [form, setForm] = useState({ studentReg: '', studentPhone: '', studentName: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [position, setPosition] = useState(0);
  const [wait, setWait] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => { fetch('/api/queue/campuses').then(r => r.json()).then(setCampuses); }, []);

  const selectCampus = (c) => {
    setSelected({ campus: c, dept: null, service: null });
    setLoading(true);
    fetch(`/api/queue/departments/${c.id}`).then(r => r.json()).then(d => {
      setDepartments(d); setStep(1); setLoading(false);
    });
  };

  const selectDept = (d) => {
    setSelected(s => ({ ...s, dept: d, service: null }));
    setLoading(true);
    fetch(`/api/queue/services/${d.id}`).then(r => r.json()).then(s => {
      setServices(s); setStep(2); setLoading(false);
    });
  };

  const selectService = (s) => {
    setSelected(prev => ({ ...prev, service: s }));
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentReg.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/queue/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentReg: form.studentReg,
          studentPhone: form.studentPhone,
          studentName: form.studentName,
          campusId: selected.campus.id,
          departmentId: selected.dept.id,
          serviceId: selected.service.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.token);
        setPosition(data.position);
        setWait(data.estimatedWaitMin);
        setStep(4);
      } else {
        setError(data.error);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => { if (step > 0) setStep(s => s - 1); };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-unilak-navy">Join a Queue</h1>
        <p className="text-gray-500 mt-1">Get your token and track your turn in real time</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
              ${i < step ? 'bg-unilak-green text-white' : i === step ? 'bg-unilak-navy text-white' : 'bg-gray-200 text-gray-400'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs hidden sm:inline ${i === step ? 'text-unilak-navy font-semibold' : 'text-gray-400'}`}>
              {s}
            </span>
            {i < 4 && <div className={`w-6 h-0.5 ${i < step ? 'bg-unilak-green' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm mb-6">{error}</div>
      )}

      {/* Step 0: Campus */}
      {step === 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Select your campus</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {campuses.map(c => (
              <button key={c.id} onClick={() => selectCampus(c)}
                className="card text-center hover:border-unilak-navy hover:shadow-lg transition-all p-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-unilak-navy to-unilak-green
                  flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                  {c.code}
                </div>
                <h3 className="font-semibold text-unilak-navy">{c.name}</h3>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Department */}
      {step === 1 && (
        <div>
          <button onClick={goBack} className="text-sm text-gray-500 hover:text-unilak-navy mb-4">← Back to campuses</button>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Select department</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {departments.map(d => (
              <button key={d.id} onClick={() => selectDept(d)}
                className="card text-center hover:border-unilak-navy transition-all p-6">
                <h3 className="font-semibold text-unilak-navy text-lg">{d.name}</h3>
                <span className="text-xs text-gray-400">{d.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Service */}
      {step === 2 && (
        <div>
          <button onClick={goBack} className="text-sm text-gray-500 hover:text-unilak-navy mb-4">← Back to departments</button>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Select service</h2>
          <div className="grid gap-4">
            {services.map(s => (
              <button key={s.id} onClick={() => selectService(s)}
                className="card flex items-center justify-between hover:border-unilak-navy transition-all">
                <div>
                  <h3 className="font-semibold text-unilak-navy">{s.name}</h3>
                  <p className="text-xs text-gray-400">~{s.avg_duration_min} min average</p>
                </div>
                <span className="text-unilak-green font-bold text-lg">{s.prefix}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <div>
          <button onClick={goBack} className="text-sm text-gray-500 hover:text-unilak-navy mb-4">← Back to services</button>
          <div className="card">
            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
              <strong>{selected.campus.name}</strong> → {selected.dept.name} → {selected.service.name}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
                <input type="text" value={form.studentReg} onChange={e => setForm(f => ({ ...f, studentReg: e.target.value }))}
                  placeholder="e.g. 2024/CS/001" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))}
                  placeholder="Optional" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" value={form.studentPhone} onChange={e => setForm(f => ({ ...f, studentPhone: e.target.value }))}
                  placeholder="Optional — for SMS alerts" className="input-field" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Getting your token...' : 'Get Token'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Step 4: Token live tracker */}
      {step === 4 && result && (
        <div className="text-center">
          <div className="card max-w-md mx-auto">
            <p className="text-sm text-gray-500 mb-2">Your Token</p>
            <div className="text-5xl font-extrabold text-unilak-navy mb-4 tracking-wider">{result.fullToken}</div>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-unilak-green">{position + 1}</div>
                <div className="text-xs text-gray-400">Position</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-unilak-gold">{wait}</div>
                <div className="text-xs text-gray-400">Est. min</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div className="bg-unilak-green h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, 100 - (position / (position + 5)) * 100)}%` }} />
            </div>
            <p className="text-sm text-gray-500">{result.department_name} — {result.service_name}</p>
            <p className="text-xs text-gray-400 mt-2">Stay nearby. You'll be called when it's your turn.</p>
            <Link to="/queue/status" className="inline-block mt-4 text-unilak-green font-medium text-sm hover:underline">
              Check all my tokens
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
