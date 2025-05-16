export const adjustWebExclusives = (): void => {
  const webGames = document.getElementsByClassName('webGame') as HTMLCollectionOf<HTMLElement>;
  const button = document.getElementById('btnWebGames');

  if (!button) {
    return;
  }
  const buttonTitle = button.innerText;

  Array.from(webGames).forEach((webgame) => {
    webgame.style.display = webgame.style.display === 'none' ? '' : 'none';
  });

  button.innerText = buttonTitle.startsWith('Show') ? 'Hide Web Exclusive Games' : 'Show Web Exclusive Games';
};
