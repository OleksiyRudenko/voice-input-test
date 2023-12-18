// source: https://developer.chrome.com/blog/voice-driven-web-apps-introduction-to-the-web-speech-api
import { showInfo } from "./page-elements.mjs";
import { extractInt, capitalize, linebreakHTMLize } from "./text-processing.mjs";

const recognitionState = {
  isRecognitionInProgress: false,

};

const recognitionStart = ({target}) => {
  const recognitionInputId = extractInt(target.id);
  if (!recognitionInputId) {
    return;
  }
  console.log(`Input controls #${recognitionInputId} selected.`);

  const recognitionFlagId = `recognition-switch${recognitionInputId}`;
  const recognitionFlag = document.getElementById(recognitionFlagId);
  if (recognitionFlag.checked) {
    console.log('--- attempting to start recognition');
    // do the magic
    const recognitionIcon = document.getElementById(`recognition-icon${recognitionInputId}`);
    recognitionIcon.classList.add('recording-active');
  } else {
    console.log(`--- Recognition disabled by user.`);
  }
};

const recognitionStop = ({target}) => {
  const recognitionInputId = extractInt(target.id);
  if (!recognitionInputId) {
    return;
  }

  const recognitionFlag = document.getElementById(`recognition-switch${recognitionInputId}`);
  if (recognitionFlag.checked) {
    console.log('--- stopping recognition');
    const recognitionIcon = document.getElementById(`recognition-icon${recognitionInputId}`);
    recognitionIcon.classList.remove('recording-active');

  }
};

export const registerRecognitionCallbacks = () => {
  const SpeechRecognitionEngine = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionEngine();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognitionState.isRecognitionInProgress = true;
    showInfo('info_speak_now');
    start_img.src = 'mic-animate.gif';
  }
};

// ======================================================

let final_transcript = '';
let ignore_onend;
let start_timestamp;


{


  recognition.onerror = function(event) {
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

  recognition.onend = function() {
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

  recognition.onresult = function(event) {
    let interim_transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }

    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreakHTMLize(final_transcript);
    interim_span.innerHTML = linebreakHTMLize(interim_transcript);
    if (final_transcript || interim_transcript) {
      showButtons('inline-block');
    }
  }
}

function startButton(event) {
  if (isRecognitionInProgress) {
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
