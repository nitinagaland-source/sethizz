// src/hooks/useCountdown.ts
import { useState, useEffect } from 'react';

interface CountdownTime {
  hours: string;
  minutes: string;
  seconds: string;
}

export function useCountdown(initialHours = 12, initialMinutes = 45, initialSeconds = 32): CountdownTime {
  const [totalSeconds, setTotalSeconds] = useState(
    initialHours * 3600 + initialMinutes * 60 + initialSeconds
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 0) return 24 * 3600; // Reset after 24h
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => String(num).padStart(2, '0');

  return {
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };
}
