  function languageSwitcher() {
    // use URL to read current language
    const url = new URL(window.location.href);
    const segments = url.pathname
      .replace(/^\/+/, "")
      .split("/")
      .filter(Boolean);
    const currentLanguage = segments[0] === "cy" ? "cy" : "en";

    // Remove active class from all language options
    const allLangDivs = document.querySelectorAll("#language-switcher > div");
    allLangDivs.forEach((div) => div.classList.remove("active"));

    // Add active class to current language
    const activeDiv = document.querySelector(
      `#language-switcher #${currentLanguage}`
    );
    if (activeDiv) {
      activeDiv.classList.add("active");
    }
  }

  export default languageSwitcher;