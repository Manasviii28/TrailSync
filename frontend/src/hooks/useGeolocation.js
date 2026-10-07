import { useState, useEffect, useRef } from 'react';

/**
 * Calculates Haversine distance between two GPS coordinates in kilometers.
 */
const calculateHaversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useGeolocation = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [distance, setDistance] = useState(0); // in km
  const [routePoints, setRoutePoints] = useState([]);
  const [error, setError] = useState(null);
  const [gpsSupported, setGpsSupported] = useState(true);

  const watchIdRef = useRef(null);
  const lastCoordRef = useRef(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setGpsSupported(false);
      setError('Geolocation is not supported by your browser');
    }
  }, []);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setGpsSupported(false);
      setError('Geolocation not available');
      return;
    }

    setError(null);
    setIsTracking(true);
    setIsPaused(false);
    setDistance(0);
    setRoutePoints([]);
    lastCoordRef.current = null;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        if (isPaused) return;

        const { latitude, longitude } = position.coords;
        const newPoint = { lat: latitude, lng: longitude, timestamp: new Date() };

        setRoutePoints((prev) => [...prev, newPoint]);

        if (lastCoordRef.current) {
          const addedDist = calculateHaversine(
            lastCoordRef.current.lat,
            lastCoordRef.current.lng,
            latitude,
            longitude
          );

          // Ignore noise (< 3 meters) or extreme jumps (> 500 meters per update)
          if (addedDist > 0.003 && addedDist < 0.5) {
            setDistance((prevDist) => parseFloat((prevDist + addedDist).toFixed(3)));
          }
        }

        lastCoordRef.current = { lat: latitude, lng: longitude };
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setError(`GPS error: ${err.message}. You can use manual entry fallback.`);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      }
    );
  };

  const pauseTracking = () => {
    setIsPaused(true);
  };

  const resumeTracking = () => {
    setIsPaused(false);
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setIsPaused(false);
  };

  return {
    isTracking,
    isPaused,
    distance,
    setDistance,
    routePoints,
    error,
    gpsSupported,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
  };
};
