import { DateTime } from 'luxon';
import { onUnmounted, ref } from 'vue';

/**
 * Composable to get current time that updates at a fixed interval
 * instead of on every reactive change, reducing unnecessary re-renders
 *
 * @param intervalMs - Update interval in milliseconds (default: 60000ms = 1 minute)
 * @returns ref containing current ISO string in ET timezone
 */
export const useCurrentTimeET = (intervalMs: number = 60000) => {
  const currentTimeISO = ref<string | null>(null);

  // Initialize immediately
  const updateTime = () => {
    const nowInET = DateTime.now().setZone('America/New_York');
    currentTimeISO.value = nowInET.toISO({ includeOffset: false });
  };

  updateTime();

  // Set up interval to update time periodically
  const intervalId = setInterval(updateTime, intervalMs);

  onUnmounted(() => {
    clearInterval(intervalId);
  });

  return { currentTimeISO };
};
