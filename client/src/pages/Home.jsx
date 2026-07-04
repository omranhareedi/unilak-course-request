import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-br from-unilak-navy via-unilak-navy to-unilak-green text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            University of Kigali — Online Portal
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Course Request
            <span className="block text-unilak-gold">Made Simple</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Submit your departmental course requests online. No more long queues or waiting
            — your application goes directly to the department for review.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/apply"
              className="bg-unilak-gold text-unilak-navy font-bold px-8 py-3.5 rounded-lg text-lg
                         hover:bg-yellow-400 transition-all duration-200 shadow-lg shadow-black/20"
            >
              Submit a Request
            </Link>
            <Link
              to="/status"
              className="border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-lg text-lg
                         hover:border-white hover:bg-white/10 transition-all duration-200"
            >
              Check Status
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-unilak-navy mb-4">How It Works</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Three simple steps to submit and track your departmental course request.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Submit Request',
              desc: 'Fill out the online form with your registration number, email, and request details.',
              color: 'from-unilak-navy to-blue-700',
            },
            {
              step: '02',
              title: 'Department Reviews',
              desc: 'Your request is sent directly to the department for prompt review and decision.',
              color: 'from-unilak-green to-green-600',
            },
            {
              step: '03',
              title: 'Get Notified',
              desc: 'Receive an automatic email with the department\'s decision and next steps.',
              color: 'from-unilak-gold to-yellow-500',
            },
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
          <h2 className="text-3xl font-bold text-unilak-navy mb-6">Why Use This Portal?</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-left">
            {[
              { title: 'No More Queues', desc: 'Submit from anywhere — no need to physically visit the department.' },
              { title: 'Fast Response', desc: 'Get a decision emailed to you directly without delay.' },
              { title: 'Track Everything', desc: 'Check your application status anytime using your registration number.' },
              { title: 'Paperless', desc: 'Fully digital process — good for the environment and your time.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-unilak-green mt-2 shrink-0" />
                <div>
                  <h4 className="font-semibold text-unilak-navy">{item.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
