import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-br from-unilak-navy to-unilak-green text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            UNILAK
            <span className="block text-unilak-gold text-2xl sm:text-3xl mt-1">Smart Queuing System</span>
          </h1>
          <p className="text-lg text-gray-200 max-w-xl mx-auto mb-8">
            Get a token, track your turn, get served. No more waiting in line.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/queue"
              className="bg-unilak-gold text-unilak-navy font-bold px-8 py-3.5 rounded-lg text-lg
                         hover:bg-yellow-400 transition-all shadow-lg">
              Join a Queue
            </Link>
            <Link to="/queue/status"
              className="border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-lg text-lg
                         hover:border-white transition-all">
              Check My Token
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-unilak-navy text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Get Token', desc: 'Select campus, department, and service. Enter your reg number.' },
            { step: '2', title: 'Wait', desc: 'See your position and estimated time. Get notified when it\'s your turn.' },
            { step: '3', title: 'Get Served', desc: 'Walk to the counter when your token is called on the display.' },
          ].map((item) => (
            <div key={item.step} className="card text-center p-6">
              <div className="w-10 h-10 rounded-full bg-unilak-navy text-white flex items-center justify-center font-bold mx-auto mb-3">
                {item.step}
              </div>
              <h3 className="font-bold text-unilak-navy mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/queue" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all block">
              <h3 className="font-bold text-unilak-navy mb-1">Join Queue</h3>
              <p className="text-sm text-gray-500">Get a token for any department.</p>
            </Link>
            <Link to="/display" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all block">
              <h3 className="font-bold text-unilak-navy mb-1">Live Display</h3>
              <p className="text-sm text-gray-500">See current tokens on the big screen.</p>
            </Link>
            <Link to="/login" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all block">
              <h3 className="font-bold text-unilak-navy mb-1">Login</h3>
              <p className="text-sm text-gray-500">Student, staff &amp; administration access.</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
