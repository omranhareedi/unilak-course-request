export default function Footer() {
  return (
    <footer className="bg-unilak-navy text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-2">UNILAK</h3>
            <p className="text-sm leading-relaxed">
              University of Lay Adventists of Kigali — Smart Queuing System for campus services.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/apply" className="hover:text-white transition-colors">Submit Request</a></li>
              <li><a href="/status" className="hover:text-white transition-colors">Check Status</a></li>
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
