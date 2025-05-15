export const adjustNavBar = (): void => {
  const navbar = document.querySelector('.navbar');
  const main = document.querySelector('#Main');
  if (navbar && main) {
    const paddingAddition = navbar.clientHeight - 7;
    main.setAttribute('style', `padding-top: ${paddingAddition.toString()}px`);
  }
};
