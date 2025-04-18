import { useLocalStorage, useOnline, useWindowSize } from '@vueuse/core';

export function useAppUtils() {
  const userSettings = useLocalStorage('user-settings', { notifications: true });
  const isOnline = useOnline();
  const { width, height } = useWindowSize();
  return { userSettings, isOnline, width, height };
}
