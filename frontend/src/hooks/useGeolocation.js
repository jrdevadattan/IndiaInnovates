import { useState, useEffect, useCallback } from 'react';

const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, ...options }
    );
  }, []);

  const watchLocation = useCallback(() => {
    if (!navigator.geolocation) return () => {};
    const id = navigator.geolocation.watchPosition(
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
      (err) => setError(err.message),
      { enableHighAccuracy: true, ...options }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  return { location, error, loading, getLocation, watchLocation };
};

export default useGeolocation;
