import { pageElements, showInfo } from "./modules/page-elements.mjs";
import { populateWithLanguageOptions, createLanguageHandler } from "./modules/input-laguages.mjs";
import { recognitionStart, recognitionStop, registerRecognitionCallbacks } from "./modules/voice-input-arbitrary.mjs";

populateWithLanguageOptions(pageElements['select_language']);
const updateDialect = createLanguageHandler(pageElements['select_language'], pageElements['select_dialect']);
updateDialect(10, 0); // English, en-US

pageElements['select_language'].addEventListener('change', function () { updateDialect(this.selectedIndex) });
showInfo('info_start');

if (!('webkitSpeechRecognition' in window)) {
  showInfo('info_upgrade');
} else {
  registerRecognitionCallbacks();
  ['input1', 'input2'].forEach(inputId => {
    pageElements[inputId].addEventListener("focus", recognitionStart);
    pageElements[inputId].addEventListener("blur", recognitionStop);
  });
}
