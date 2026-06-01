import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

/**
 * Hook to get current time that updates at a fixed interval
 * instead of on every reactive change, reducing unnecessary re-renders
 *
 * @param intervalMs - Update interval in milliseconds (default: 60000ms = 1 minute)
 * @returns current ISO string in ET timezone
 */
export const useCurrentTimeET = (intervalMs: number = 60000) => {
  const [currentTimeISO, setCurrentTimeISO] = useState<string | null>(null);

  useEffect(() => {
    // Initialize immediately
    const updateTime = () => {
      const nowInET = DateTime.now().setZone('America/New_York');
      setCurrentTimeISO(nowInET.toISO({ includeOffset: false }));
    };

    updateTime();

    // Set up interval to update time periodically
    const intervalId = setInterval(updateTime, intervalMs);

    return () => clearInterval(intervalId);
  }, [intervalMs]);

  return { currentTimeISO };
};
