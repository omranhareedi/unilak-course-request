import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const statusColors = {
  called: 'bg-blue-600',
  serving: 'bg-green-600',
};

export default function PublicDisplay() {
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [displayData, setDisplayData] = useState([]);
  const [calledToken, setCalledToken] = useState(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch('/api/queue/campuses').then(r => r.json()).then(setCampuses);
  }, []);

  useEffect(() => {
    if (!selectedCampus) return;
    const fetchDisplay = () => {
      fetch(`/api/queue/display/${selectedCampus}`)
        .then(r => r.json())
        .then(data => {
          const newCalled = data.filter(d => d.current?.status === 'called');
          if (newCalled.length > 0) {
            const latest = newCalled[0];
            if (latest.current.fullToken !== calledToken) {
              setCalledToken(latest.current.fullToken);
              try { audioRef.current?.play(); } catch {}
            }
          }
          setDisplayData(data);
        });
    };
    fetchDisplay();
    const interval = setInterval(fetchDisplay, 5000);

    const socket = io('http://localhost:5000');
    socket.emit('join-campus', selectedCampus);
    socket.on('display-update', fetchDisplay);

    return () => { clearInterval(interval); socket.disconnect(); };
  }, [selectedCampus, calledToken]);

  if (!selectedCampus) {
    return (
      <div className="min-h-screen bg-unilak-navy flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-8">UNILAK Queue Display</h1>
          <p className="text-gray-300 mb-6">Select a campus:</p>
          <div className="flex gap-4 justify-center">
            {campuses.map(c => (
              <button key={c.id} onClick={() => setSelectedCampus(c.id)}
                className="bg-white text-unilak-navy px-8 py-4 rounded-xl text-xl font-bold hover:bg-gray-100 transition-all">
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-unilak-navy text-white p-8">
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACAf39/f4B/f3+AgH9/f3+AgH9/f3+Af39/f3+AgH9/f3+Af39/f3+Af39/f4B/f3+AgH9/f39/gH9/f3+AgH9/f3+Af39/f39/gH9/f4B/f39/gH9/f39/gH9/f4B/f39/gH9/f39/gH9/f4B/f39/gH9/f39/gH9/f4B/f39/gH9/f39/gH9/f4B/f39/gH9/f39/gH9/f4B/f39/gH9/f39/gH9/f4B/f39/gH9/f39/gH9/f4B/f39/gH9/f39/gH9/f4B/f39/gH9/f39/gH9/f4B/f39/gH9/f3+AgH9/f3+Af39/f3+AgH9/f3+Af39/f3+Af39/f39/gH9/f39/gH9/f4B/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f4B/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f4B/f39/gH9/f4B/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f3+AgH9/f3+Af39/f3+AgH9/f3+Af39/f3+Af39/f3+Af39/f39/gH9/f39/gH9/f4B/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f4B/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f4B/f39/gH9/f4B/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f39/gH9/f3+" />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">UNILAK Queue System</h1>
            <p className="text-gray-300 text-lg">Now Serving</p>
          </div>
          <button onClick={() => setSelectedCampus(null)}
            className="bg-white/10 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20">
            Change Campus
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayData.map(d => (
            <div key={d.code} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-200 mb-1">{d.department}</h2>
                <p className="text-sm text-gray-400 mb-4">{d.waitingCount} waiting</p>
                {d.current ? (
                  <div className={`${statusColors[d.current.status] || 'bg-blue-600'} rounded-xl p-6 transition-all duration-300`}>
                    <div className="text-5xl font-extrabold tracking-wider">{d.current.fullToken}</div>
                    <div className="text-sm mt-2 opacity-80">{d.current.studentReg}</div>
                    <div className="text-xs mt-1 opacity-60 uppercase">{d.current.status === 'called' ? 'Please Proceed' : 'Being Served'}</div>
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-xl p-6">
                    <div className="text-2xl text-gray-400">—</div>
                    <div className="text-sm text-gray-500 mt-2">No active token</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
