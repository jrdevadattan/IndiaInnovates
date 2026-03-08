import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const HOLD_MS = 3000;

export default function SOSButton() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimer = useRef(null);
  const progressTimer = useRef(null);
  const startTime = useRef(null);

  if (!user) return null;

  const startHold = () => {
    setHolding(true);
    startTime.current = Date.now();
    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      setProgress(Math.min((elapsed / HOLD_MS) * 100, 100));
    }, 50);
    holdTimer.current = setTimeout(() => {
      clearInterval(progressTimer.current);
      setHolding(false);
      setProgress(0);
      navigate('/sos');
    }, HOLD_MS);
  };

  const cancelHold = () => {
    clearTimeout(holdTimer.current);
    clearInterval(progressTimer.current);
    setHolding(false);
    setProgress(0);
  };

  const circumference = 2 * Math.PI * 21;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative flex items-center justify-center">
        {holding && (
          <svg className="absolute" width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="21" fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth="4" />
            <circle
              cx="28"
              cy="28"
              r="21"
              fill="none"
              stroke="#ef4444"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 28 28)"
              style={{ transition: 'stroke-dashoffset 0.05s linear' }}
            />
          </svg>
        )}
        <button
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={(e) => { e.preventDefault(); startHold(); }}
          onTouchEnd={cancelHold}
          title="Hold 3s for SOS"
          className={`w-12 h-12 rounded-full text-xs font-bold text-white select-none transition-all duration-150 shadow-lg ${
            holding
              ? 'bg-red-700 scale-90 shadow-[0_0_20px_rgba(239,68,68,0.8)]'
              : 'bg-red-600 hover:bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)] hover:scale-110'
          }`}
        >
          SOS
        </button>
      </div>
      {holding && (
        <p className="text-center text-red-400 text-xs mt-1 animate-pulse">Hold...</p>
      )}
    </div>
  );
}
