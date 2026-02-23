
const setActiveState = (div, isActive) => {
  if (isActive) {
    div.dataset.active = "true";
    return;
  }

  delete div.dataset.active;
};

function languageSwitcher() {
  const url = new URL(window.location.href);
  const segments = url.pathname
  .replace(/^\/+/, "")
  .split("/")
  .filter(Boolean);
  const currentLanguage = segments[0] === "cy" ? "cy" : "en";
  
  const languageSwitcherContainerMobile = document.querySelector(".language-switcher-mobile");
  const languageSwitcherContainerDesktop = document.querySelector(".language-switcher-desktop")
  
  if (!languageSwitcherContainerMobile || !languageSwitcherContainerDesktop) return;

  const switchersDesktop = languageSwitcherContainerDesktop.querySelectorAll("[data-language]");
  const switchersMobile = languageSwitcherContainerMobile.querySelectorAll("[data-language]");
  
  const allLangDivs = [...switchersDesktop, ...switchersMobile];
  
  if (!allLangDivs.length) return;


  allLangDivs.forEach((div) => setActiveState(div, false));
  
  const activeDivs = allLangDivs.filter((div) =>
    div.dataset.language === currentLanguage
  );

  if (!activeDivs.length) {
    if (switchersDesktop[0]) setActiveState(switchersDesktop[0], true);
    if (switchersMobile[0]) setActiveState(switchersMobile[0], true);
    return;
  }
  activeDivs.forEach((activeDiv) => setActiveState(activeDiv, true));
}

export default languageSwitcher;