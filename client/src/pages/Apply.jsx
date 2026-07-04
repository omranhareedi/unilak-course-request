import { useState } from 'react';
import { Link } from 'react-router-dom';

const departments = [
  'Computer Science',
  'Information Technology',
  'Business Administration',
  'Accounting & Finance',
  'Economics',
  'Law',
  'Education',
  'Nursing & Midwifery',
  'Public Health',
  'Civil Engineering',
  'Electrical Engineering',
];

export default function Apply() {
  const [form, setForm] = useState({
    registrationNumber: '',
    email: '',
    fullName: '',
    department: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ type: 'success', message: data.message });
        setForm({ registrationNumber: '', email: '', fullName: '', department: '', message: '' });
      } else {
        setResult({ type: 'error', message: data.error });
      }
    } catch {
      setResult({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-unilak-navy">Submit a Course Request</h1>
        <p className="text-gray-500 mt-2">Fill in your details below and send your request to the department.</p>
      </div>

      {result && (
        <div className={`mb-6 p-4 rounded-lg text-sm ${
          result.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {result.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Registration Number</label>
            <input
              type="text"
              name="registrationNumber"
              value={form.registrationNumber}
              onChange={handleChange}
              placeholder="e.g. 2024/CS/001"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@unilak.ac.rw"
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Department</label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Request</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            placeholder="Describe your request — which course(s) you want to join and why..."
            className="input-field resize-y"
            required
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Already submitted?{' '}
        <Link to="/login" className="text-unilak-green font-medium hover:underline">Manage your requests</Link>
        {' | '}
        <Link to="/status" className="text-unilak-green font-medium hover:underline">Check status</Link>
      </p>
    </div>
  );
}
