export const adjustNavBar = (): void => {
  const navbar = document.querySelector('.navbar');
  const main = document.querySelector('#Main');
  if (navbar && main) {
    const widthAddition = window.innerWidth >= 641 ? 3 : 8;
    const paddingAddition = navbar.clientHeight + widthAddition;
    main.setAttribute('style', `padding-top: ${paddingAddition}px`);
  }
};

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

export const checkAllTextRows = (): void => {
  const elements = document.querySelectorAll<HTMLInputElement>('.checkBoxRow');
  const rows = document.querySelectorAll<HTMLTableRowElement>('tr.gamerow');
  elements.forEach((element) => (element.checked = true));
  rows.forEach((row) => {
    row.style.backgroundColor = '#CCC';
    row.className = 'gamerow DOPrint rowstyle';
  });
};

export const clearAllSelectedTextRows = (): void => {
  const elements = document.querySelectorAll<HTMLInputElement>('.checkBoxRow');
  const rows = document.querySelectorAll<HTMLTableRowElement>('tr.gamerow');
  elements.forEach((element) => (element.checked = false));
  rows.forEach((row) => {
    row.style.backgroundColor = '#FFF';
    row.className = 'gamerow DONTPrint rowstyle';
  });
};
