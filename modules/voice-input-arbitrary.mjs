// source: https://developer.chrome.com/blog/voice-driven-web-apps-introduction-to-the-web-speech-api
import {pageElements, showInfo} from "./page-elements.mjs";
import { extractInt, capitalize, linebreakHTMLize } from "./text-processing.mjs";
import {encodeSpecialTokens, execute, joinTokens} from "./voice-input-commands.mjs";

const recognitionState = {
  isRecognitionInProgress: false,
  recognitionInputGroupId: null,
  recognitionOutputTarget: null,
  recognitionInterimOutputTarget: null,
};

const SpeechRecognitionEngine = window.SpeechRecognition || window.webkitSpeechRecognition;
// const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
// const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;


const recognition = new SpeechRecognitionEngine();
recognition.continuous = true;
recognition.interimResults = true;

let final_transcript = '';
let ignore_onend = false;
let start_timestamp;

const insertTextAtCursor = (targetInput, text) => {
  console.log(">>> Selection:", targetInput.selectionStart, targetInput.selectionEnd, text);
  // targetInput.value = targetInput.value.substring(0, targetInput.selectionStart) + text + targetInput.value.substring(targetInput.selectionEnd);
  targetInput.setRangeText(text, targetInput.selectionStart, targetInput.selectionEnd, "end");
};

const getTime = () => {
  return new Date().toTimeString();
}

const recognitionStart = ({target}) => {
  const recognitionInputId = extractInt(target.id);
  /* if (!recognitionInputId) {
    return;
  } */
  console.log(`=============== ${getTime()}\n=> recognitionStart`);
  console.log(JSON.stringify(recognitionState));
  console.log(`Input controls #${recognitionInputId} selected.`);

  recognition.lang = pageElements['select_dialect'].value;
  const recognitionFlagId = `recognition-switch${recognitionInputId}`;
  const recognitionFlag = document.getElementById(recognitionFlagId);
  if (recognitionFlag.checked) {
    console.log('--- attempting to start recognition');
    // do the magic
    const recognitionIcon = document.getElementById(`recognition-icon${recognitionInputId}`);
    recognitionIcon.classList.add('recording-active');
    recognitionState.recognitionOutputTarget = document.getElementById(`input${recognitionInputId}`);
    recognitionState.recognitionInterimOutputTarget = document.getElementById(`interim-output${recognitionInputId}`);
    // final_transcript = recognitionState.recognitionOutputTarget.value;
    recognition.start();
  } else {
    console.log(`--- Recognition disabled by user.`);
  }
};

const recognitionStop = ({target}) => {
  const recognitionInputId = extractInt(target.id);
  /* if (!recognitionInputId) {
    return;
  } */
  console.log(`=============== ${getTime()}\n=> recognitionStop`);
  console.log(JSON.stringify(recognitionState));
  console.log(`Input controls #${recognitionInputId} blurred.`);
  const recognitionFlag = document.getElementById(`recognition-switch${recognitionInputId}`);
  if (recognitionFlag.checked) {
    console.log('--- stopping recognition');
    const recognitionIcon = document.getElementById(`recognition-icon${recognitionInputId}`);
    recognitionIcon.classList.remove('recording-active');
    recognition.stop();
  }
};

export const registerRecognitionCallbacks = () => {
  recognition.onstart = () => {
    console.log(`RECOGNITION.onStart`);
    recognitionState.isRecognitionInProgress = true;
    showInfo('info_speak_now');
    // start_img.src = 'mic-animate.gif';
  }

  recognition.onerror = (event) => {
    console.log(`RECOGNITION.onError`, event);
    if (event.error === 'no-speech') {
      start_img.src = 'mic.gif';
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error === 'audio-capture') {
      start_img.src = 'mic.gif';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error === 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  }

  recognition.onresult = (event) => {
    console.log(`RECOGNITION.onResult`, event);
    let interim_transcript = [];
    let final_transcript = [];
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      interim_transcript.push(event.results[i][0].transcript.trim().toLowerCase());
      if (event.results[i].isFinal) {
        final_transcript.push(event.results[i][0].transcript.trim().toLowerCase());
      }
    }
    recognitionState.recognitionInterimOutputTarget.value = encodeSpecialTokens(interim_transcript).join(' ');

    if (final_transcript.length) {
      /* final_span.innerHTML = linebreakHTMLize(final_transcript);
      interim_span.innerHTML = linebreakHTMLize(interim_transcript); */
      insertTextAtCursor(recognitionState.recognitionOutputTarget, joinTokens(execute(final_transcript)));
      // recognitionState.recognitionOutputTarget.value = final_transcript;
    } else {
      console.log("---- Empty input");
    }
  }

  recognition.onend = () => {
    console.log(`RECOGNITION.onEnd`);
    recognitionStop({target: recognitionState.recognitionOutputTarget});
    recognitionState.isRecognitionInProgress = false;
    if (ignore_onend) {
      return;
    }
    start_img.src = 'mic.gif';
    if (!final_transcript) {
      showInfo('info_start');
      return;
    }
    showInfo('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      const range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
  }
};



// ======================================================

function startButton(event) {
  if (recognitionState.isRecognitionInProgress) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = pageElements['select_dialect'].value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_img.src = 'mic-slash.gif';
  showInfo('info_allow');
  showButtons('none');
  start_timestamp = event.timeStamp;
}

let current_style;
function showButtons(style) {
  if (style === current_style) {
    return;
  }
  current_style = style;
}

export { recognitionStart, recognitionStop };
