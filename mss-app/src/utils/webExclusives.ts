export const adjustWebExclusives = (): void => {
  const webGames = document.querySelectorAll<HTMLElement>('.webGame');
  const button = document.querySelector('#btnWebGames');
  const buttonTitle = button?.getAttribute('value');

  webGames.forEach((webgame) => {
    webgame.style.display = webgame.style.display === 'none' ? '' : 'none';
  });

  if (buttonTitle?.startsWith('Show')) {
    button?.setAttribute('value', 'Hide Web Exclusive Games');
  } else {
    button?.setAttribute('value', 'Show Web Exclusive Games');
  }
};
