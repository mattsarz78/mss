import { useOnline } from '@vueuse/core';

export const useAppUtils = () => {
  const isOnline = useOnline();
  return { isOnline };
};
