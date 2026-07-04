import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Apply from './pages/Apply';
import Status from './pages/Status';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentQueue from './pages/StudentQueue';
import QueueStatus from './pages/QueueStatus';
import StaffDashboard from './pages/StaffDashboard';
import PublicDisplay from './pages/PublicDisplay';
import AdminAnalytics from './pages/AdminAnalytics';

export default function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/apply" element={<ProtectedRoute role="student"><Apply /></ProtectedRoute>} />
            <Route path="/status" element={<Status />} />
            <Route path="/queue" element={<StudentQueue />} />
            <Route path="/queue/status" element={<QueueStatus />} />
            <Route path="/display" element={<PublicDisplay />} />
            <Route path="/staff/dashboard" element={<ProtectedRoute role="staff"><StaffDashboard /></ProtectedRoute>} />
            <Route path="/staff/courses" element={<ProtectedRoute role="staff"><Dashboard /></ProtectedRoute>} />
            <Route path="/staff/analytics" element={<ProtectedRoute role="staff"><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
