export const adjustWebExclusives = (): void => {
  const webGames = document.querySelectorAll<HTMLElement>('.webGame');
  const button = document.getElementById('btnWebGames');

  if (!button) {
    return;
  }
  const buttonTitle = button.innerText;

  webGames.forEach((webgame) => {
    webgame.style.display = webgame.style.display === 'none' ? '' : 'none';
  });

  button.innerText = buttonTitle.startsWith('Show') ? 'Hide Web Exclusive Games' : 'Show Web Exclusive Games';
};
