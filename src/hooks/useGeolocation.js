import { useCallback, useState } from "react";

/**
 * Wraps navigator.geolocation with loading/error state and a manual
 * `locate()` trigger, since we want to call it both on mount and on
 * demand (the "use my location" button).
 */
export function useGeolocation() {
  const [status, setStatus] = useState("idle"); // idle | locating | success | denied | unsupported | error

  const locate = useCallback(() => {
    return new Promise((resolve) => {
      if (!("geolocation" in navigator)) {
        setStatus("unsupported");
        resolve(null);
        return;
      }
      setStatus("locating");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus("success");
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
      );
    });
  }, []);

  return { status, locate };
}
