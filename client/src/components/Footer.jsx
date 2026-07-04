import UnilakLogo from './UnilakLogo';

export default function Footer() {
  return (
    <footer className="bg-unilak-navy text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <UnilakLogo size={50} showText={false} />
            <p className="text-sm leading-relaxed mt-3">
              University of Lay Adventists of Kigali — Smart Queuing System for campus services.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/queue" className="hover:text-white transition-colors">Join Queue</a></li>
              <li><a href="/queue/status" className="hover:text-white transition-colors">My Tokens</a></li>
              <li><a href="/staff/login" className="hover:text-white transition-colors">Staff Login</a></li>
              <li><a href="/admin" className="hover:text-white transition-colors">Admin Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>UNILAK Main Campus, Kigali</li>
              <li>info@unilak.ac.rw</li>
              <li>+250 788 000 000</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} University of Lay Adventists of Kigali — UNILAK. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
