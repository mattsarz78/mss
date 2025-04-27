export const adjustNavBar = (): void => {
  const navbar = document.querySelector('.navbar');
  const main = document.querySelector('#Main');
  if (navbar && main) {
    const widthAddition = -7;
    const paddingAddition = navbar.clientHeight + widthAddition;
    main.setAttribute('style', `padding-top: ${paddingAddition.toString()}px`);
  }
};
