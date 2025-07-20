import { computed, ref } from 'vue';

export const useWebExclusives = () => {
  const isWebGamesHidden = ref(false);

  const toggleWebExclusives = () => {
    isWebGamesHidden.value = !isWebGamesHidden.value;
    const webGames = document.getElementsByClassName('webGame') as HTMLCollectionOf<HTMLElement>;

    Array.from(webGames).forEach((webgame) => {
      webgame.style.display = isWebGamesHidden.value ? 'none' : '';
    });
  };

  const buttonText = computed(() => (isWebGamesHidden.value ? 'Show Web Exclusive Games' : 'Hide Web Exclusive Games'));

  return { isWebGamesHidden, toggleWebExclusives, buttonText };
};
