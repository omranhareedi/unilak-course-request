import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Apply from './pages/Apply';
import Status from './pages/Status';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import StudentLogin from './pages/StudentLogin';
import StudentDashboard from './pages/StudentDashboard';
import StudentQueue from './pages/StudentQueue';
import QueueStatus from './pages/QueueStatus';
import StaffLogin from './pages/StaffLogin';
import StaffDashboard from './pages/StaffDashboard';
import PublicDisplay from './pages/PublicDisplay';
import AdminAnalytics from './pages/AdminAnalytics';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/status" element={<Status />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/queue" element={<StudentQueue />} />
          <Route path="/queue/status" element={<QueueStatus />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/display" element={<PublicDisplay />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
