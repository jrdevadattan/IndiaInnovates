import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useGeolocation from '../../hooks/useGeolocation';
import { createSos } from '../../services/sos.service';

const HOLD_DURATION = 3000;

export default function SOSPage() {
  const navigate = useNavigate();
  const { location, getLocation } = useGeolocation();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('MEDICAL');
  const [submitting, setSubmitting] = useState(false);
  const holdTimer = useRef(null);
  const progressTimer = useRef(null);
  const startTime = useRef(null);

  useEffect(() => {
    getLocation();
  }, []);

  const startHold = () => {
    if (submitting) return;
    setHolding(true);
    startTime.current = Date.now();
    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      setProgress(Math.min((elapsed / HOLD_DURATION) * 100, 100));
    }, 50);
    holdTimer.current = setTimeout(() => {
      clearInterval(progressTimer.current);
      setProgress(100);
      triggerSOS();
    }, HOLD_DURATION);
  };

  const cancelHold = () => {
    clearTimeout(holdTimer.current);
    clearInterval(progressTimer.current);
    setHolding(false);
    setProgress(0);
  };

  const triggerSOS = async () => {
    setSubmitting(true);
    setHolding(false);
    try {
      const formData = new FormData();
      formData.append('category', category);
      if (description) formData.append('description', description);
      if (location) {
        formData.append('latitude', location.lat);
        formData.append('longitude', location.lng);
      }
      const { data } = await createSos(formData);
      toast.success('SOS Alert sent! Help is on the way.');
      navigate(`/sos/${data.sos._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send SOS');
      setProgress(0);
    } finally {
      setSubmitting(false);
    }
  };

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#F5F5F2] flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-red-500 mb-2">SOS Emergency</h1>
      <p className="text-stone-500 text-sm mb-8 text-center max-w-xs">
        Hold the button for 3 seconds to send an emergency alert to nearby NGOs and volunteers.
      </p>

      {/* Category selector */}
      <div className="flex gap-2 mb-8 flex-wrap justify-center">
        {['MEDICAL', 'FIRE', 'CRIME', 'FLOOD', 'ACCIDENT', 'OTHER'].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border-2 transition-colors ${
              category === c
                ? 'bg-red-500 border-red-500 text-white'
                : 'border-stone-300 text-stone-500 bg-white hover:border-red-400'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Hold button with circular progress */}
      <div className="relative flex items-center justify-center mb-8">
        <svg className="absolute" width="128" height="128" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="54" fill="none" stroke="#e7e5e4" strokeWidth="8" />
          <circle
            cx="64"
            cy="64"
            r="54"
            fill="none"
            stroke="#ef4444"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 64 64)"
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        <button
          onMouseDown={startHold}
          onMouseUp={cancelHold}
          onMouseLeave={cancelHold}
          onTouchStart={startHold}
          onTouchEnd={cancelHold}
          disabled={submitting}
          className={`w-24 h-24 rounded-full text-white font-bold text-lg select-none transition-all duration-150 z-10 ${
            holding
              ? 'bg-red-700 scale-95 shadow-[0_0_40px_rgba(239,68,68,0.5)]'
              : 'bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
          } ${submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {submitting ? '...' : 'SOS'}
        </button>
      </div>

      {holding && (
        <p className="text-red-500 animate-pulse text-sm mb-4 font-medium">Keep holding... {Math.ceil((HOLD_DURATION * (1 - progress / 100)) / 1000)}s</p>
      )}

      <textarea
        className="w-full max-w-sm bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm text-[#1a1a1a] placeholder-stone-400 resize-none mb-4 focus:outline-none focus:border-red-400 transition-colors"
        rows={3}
        placeholder="Brief description of the emergency (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {location ? (
        <p className="text-[#5c8a00] text-xs font-medium">Location detected: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
      ) : (
        <p className="text-amber-500 text-xs font-medium">Detecting your location...</p>
      )}

      <button onClick={() => navigate(-1)} className="mt-8 text-stone-400 hover:text-stone-600 text-sm transition-colors">
        ← Go back
      </button>
    </div>
  );
}
