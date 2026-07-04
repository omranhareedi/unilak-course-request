import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const steps = ['Service', 'Details', 'Queue'];

export default function StudentQueue() {
  const [step, setStep] = useState(0);
  const [campus, setCampus] = useState(null);
  const [dept, setDept] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [form, setForm] = useState({ studentReg: '', studentPhone: '', studentName: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [position, setPosition] = useState(0);
  const [wait, setWait] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/queue/campuses').then(r => r.json()).then(campuses => {
      if (campuses.length > 0) {
        const c = campuses[0];
        setCampus(c);
        fetch(`/api/queue/departments/${c.id}`).then(r => r.json()).then(deps => {
          const cis = deps.find(d => d.code === 'CIS');
          if (cis) {
            setDept(cis);
            fetch(`/api/queue/services/${cis.id}`).then(r => r.json()).then(s => {
              setServices(s); setLoading(false);
            });
          } else {
            setLoading(false);
          }
        });
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentReg.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/queue/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentReg: form.studentReg,
          studentPhone: form.studentPhone,
          studentName: form.studentName,
          campusId: campus.id,
          departmentId: dept.id,
          serviceId: selectedService.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.token);
        setPosition(data.position);
        setWait(data.estimatedWaitMin);
        setStep(2);
      } else {
        setError(data.error);
      }
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => { if (step > 0) setStep(s => s - 1); };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-unilak-navy">Join a Queue</h1>
        <p className="text-gray-500 mt-1">Get your token and track your turn in real time</p>
      </div>

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
            {i < 2 && <div className={`w-6 h-0.5 ${i < step ? 'bg-unilak-green' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm mb-6">{error}</div>
      )}

      {loading && (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      )}

      {!loading && step === 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Select service</h2>
          <div className="grid gap-4">
            {services.map(s => (
              <button key={s.id} onClick={() => { setSelectedService(s); setStep(1); }}
                className="card flex items-center justify-between hover:border-unilak-navy transition-all">
                <div>
                  <h3 className="font-semibold text-unilak-navy">{s.name}</h3>
                  <p className="text-xs text-gray-400">~{s.avg_duration_min} min average</p>
                </div>
                <span className="text-unilak-green font-bold text-lg">{s.prefix}</span>
              </button>
            ))}
            {services.length === 0 && (
              <p className="text-center text-gray-400 py-8">No services available.</p>
            )}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <button onClick={goBack} className="text-sm text-gray-500 hover:text-unilak-navy mb-4">← Back to services</button>
          <div className="card">
            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
              {dept?.name} → {selectedService?.name}
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
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Getting your token...' : 'Get Token'}
              </button>
            </form>
          </div>
        </div>
      )}

      {step === 2 && result && (
        <div className="text-center">
          <div className="card max-w-md mx-auto">
            <p className="text-sm text-gray-500 mb-2">Your Token</p>
            <div className="text-5xl font-extrabold text-unilak-navy mb-4 tracking-wider">{result.fullToken}</div>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-unilak-green">{position}</div>
                <div className="text-xs text-gray-400">Ahead of you</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-unilak-gold">{wait}</div>
                <div className="text-xs text-gray-400">Est. min</div>
              </div>
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
