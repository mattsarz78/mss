export const checkAllTextRows = (): void => {
  const elements = document.getElementsByClassName('checkBoxRow') as HTMLCollectionOf<HTMLInputElement>;
  const rows = document.getElementsByClassName('gamerow') as HTMLCollectionOf<HTMLTableRowElement>;
  Array.from(elements).forEach((element) => (element.checked = true));
  Array.from(rows).forEach((row) => {
    row.style.backgroundColor = '#CCC';
    row.className = 'gamerow DOPrint rowstyle';
  });
};

export const clearAllSelectedTextRows = (): void => {
  const elements = document.getElementsByClassName('checkBoxRow') as HTMLCollectionOf<HTMLInputElement>;
  const rows = document.getElementsByClassName('gamerow') as HTMLCollectionOf<HTMLTableRowElement>;
  Array.from(elements).forEach((element) => (element.checked = false));
  Array.from(rows).forEach((row) => {
    row.style.backgroundColor = '#FFF';
    row.className = 'gamerow DONTPrint rowstyle';
  });
};
