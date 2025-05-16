export const adjustNavBar = (): void => {
  const navbar = document.getElementsByClassName('navbar')[0];
  const main = document.getElementById('Main');
  if (main) {
    const paddingAddition = navbar.clientHeight - 7;
    main.style.paddingTop = `${paddingAddition.toString()}px`;
  }
};
