import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-br from-unilak-navy via-unilak-navy to-unilak-green text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            University of Kigali — Smart Queue System
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Smart Queuing
            <span className="block text-unilak-gold">For Every Department</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get a virtual token from anywhere on campus. Track your position in real time,
            receive alerts when it's your turn, and never wait in a physical line again.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/queue"
              className="bg-unilak-gold text-unilak-navy font-bold px-8 py-3.5 rounded-lg text-lg
                         hover:bg-yellow-400 transition-all duration-200 shadow-lg shadow-black/20">
              Join a Queue
            </Link>
            <Link to="/queue/status"
              className="border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-lg text-lg
                         hover:border-white hover:bg-white/10 transition-all duration-200">
              Check My Token
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-unilak-navy mb-4">How It Works</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Three simple steps to get served without the wait.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Get Your Token', desc: 'Select your campus, department, and service. Enter your details and receive a unique queue token instantly.', color: 'from-unilak-navy to-blue-700' },
            { step: '02', title: 'Track Live Position', desc: 'See exactly how many people are ahead of you and your estimated waiting time. No more guessing.', color: 'from-unilak-green to-green-600' },
            { step: '03', title: 'Get Called & Served', desc: 'Watch the public display or get notified when it\'s your turn. Walk directly to the counter — no waiting in line.', color: 'from-unilak-gold to-yellow-500' },
          ].map((item) => (
            <div key={item.step} className="card text-center group">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color}
                              flex items-center justify-center text-white font-bold text-lg mx-auto mb-5
                              group-hover:scale-110 transition-transform duration-200`}>
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-unilak-navy mb-3">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-unilak-navy mb-6">Three Interfaces, One System</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            {[
              { title: 'Student Mobile', desc: 'Join queues, track your position, and get notified — all from your phone.', color: 'from-unilak-navy' },
              { title: 'Staff Dashboard', desc: 'Call next, transfer, skip, or mark no-show. Full control of your queue.', color: 'from-unilak-green' },
              { title: 'Public Display', desc: 'Large-screen TV view showing currently called tokens with audio chime.', color: 'from-unilak-gold' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} to-gray-600 mb-4`} />
                <h4 className="font-semibold text-unilak-navy mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 gap-6">
          <Link to="/queue" className="card hover:border-unilak-navy transition-all p-8">
            <h3 className="text-xl font-bold text-unilak-navy mb-2">Get a Queue Token →</h3>
            <p className="text-sm text-gray-500">Join the queue from anywhere on campus.</p>
          </Link>
          <Link to="/display" className="card hover:border-unilak-navy transition-all p-8">
            <h3 className="text-xl font-bold text-unilak-navy mb-2">Live Display →</h3>
            <p className="text-sm text-gray-500">See what's currently being served on the big screen.</p>
          </Link>
          <Link to="/staff/login" className="card hover:border-unilak-navy transition-all p-8">
            <h3 className="text-xl font-bold text-unilak-navy mb-2">Staff Login →</h3>
            <p className="text-sm text-gray-500">Manage your department queue.</p>
          </Link>
          <Link to="/apply" className="card hover:border-unilak-navy transition-all p-8">
            <h3 className="text-xl font-bold text-unilak-navy mb-2">Course Requests →</h3>
            <p className="text-sm text-gray-500">Submit a departmental course request.</p>
          </Link>
        </div>
      </section>
    </>
  );
}
