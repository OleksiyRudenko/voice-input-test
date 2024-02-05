import { inputLanguages as languages } from "./config.mjs";

const populateWithLanguageOptions = (selectElement) => {
  for (let i = 0; i < languages.length; i++) {
    selectElement.options[i] = new Option(languages[i][0], `${i}`);
  }
}

const createLanguageHandler = ( languageSelectElement, dialectSelectElement ) => {
  return function (languageIndex = 0, dialectIndex = 0) {
    languageSelectElement.selectedIndex = languageIndex;
    dialectSelectElement.length = 0;
    const dialects = languages[languageSelectElement.selectedIndex];
    for (let i = 1; i < dialects.length; i++) {
      dialectSelectElement.options.add(new Option(dialects[i][1], dialects[i][0]));
    }
    dialectSelectElement.style.visibility = dialects[1].length === 1 ? 'hidden' : 'visible';
    dialectSelectElement.selectedIndex = dialectIndex;
  };
};

export { populateWithLanguageOptions, createLanguageHandler }
