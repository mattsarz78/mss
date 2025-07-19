import { useOnline } from '@vueuse/core';

export function useAppUtils() {
  const isOnline = useOnline();
  return { isOnline };
}
