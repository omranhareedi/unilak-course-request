import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

function getStored() {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token') || localStorage.getItem('staffToken') || localStorage.getItem('studentToken');
  const user = localStorage.getItem('user');
  if (!role || !token) return { role: null, token: null, user: null };
  return { role, token, user: user ? JSON.parse(user) : null };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStored);

  useEffect(() => {
    const stored = getStored();
    if (stored.role !== auth.role || stored.token !== auth.token) {
      setAuth(stored);
    }
  }, []);

  const login = async (form, role) => {
    let url, body;
    if (role === 'student') {
      url = '/api/students/login';
      body = { registrationNumber: form.registrationNumber, email: form.email };
    } else if (role === 'staff') {
      url = '/api/queue/staff/login';
      body = { email: form.email, password: form.password };
    } else {
      url = '/api/admin/login';
      body = { email: form.email, password: form.password };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    localStorage.clear();
    const user = data.student || data.staff || data.admin || { email: form.email };
    localStorage.setItem('role', role);
    localStorage.setItem('user', JSON.stringify(user));

    if (role === 'student') {
      localStorage.setItem('studentToken', data.token);
      localStorage.setItem('studentReg', user.registrationNumber);
    } else if (role === 'staff') {
      localStorage.setItem('staffToken', data.token);
      localStorage.setItem('staffName', user.name);
    } else {
      localStorage.setItem('token', data.token);
    }

    setAuth({ role, token: data.token, user });
    return { role, redirect: role === 'student' ? '/student/dashboard' : role === 'staff' ? '/staff/dashboard' : '/admin/dashboard' };
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ role: null, token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, isAuthenticated: !!auth.role }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
