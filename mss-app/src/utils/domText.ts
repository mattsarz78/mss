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
