import { useEffect, useState } from "react";

/** Drop-in useState that persists to localStorage under `key`. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage unavailable (private browsing, quota, etc.) — fail silently.
    }
  }, [key, value]);

  return [value, setValue];
}
