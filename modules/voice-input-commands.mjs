/**
 * Removes all preceding tokens.
 * @param tokens {Array}
 * @param index {number}
 */
const undo = (tokens, index) => [];

/**
 * IGNORED. (to do: Reverts latest undo)
 * @param tokens
 * @param index
 */
const redo = (tokens, index) => tokens;

/**
 * Removes last word
 * @param tokens
 * @param index
 * @returns {*}
 */
const backspace = (tokens, index) => tokens.slice(0, tokens.length - 1);

const tokensRegistry = {
  replacers: {
    "full stop": () => ".",
    "comma": () => ",",
    "exclamation mark": () => "!",
    "question mark": () => "?",
    "dash": () => "-",
    "new line": () => "\n",
  },
  commands: {
    "backspace": backspace,
    "undo": undo,
    "redo": redo,
  },
};

const replaceTokens = Object.keys(tokensRegistry.replacers);
const commandTokens = Object.keys(tokensRegistry.commands);
const allTokens = [...replaceTokens, ...commandTokens];
const multiwordTokens = allTokens.reduce((accum, token) => {
  if (token.split(" ").length > 1) {
    accum.push(token.split(" "));
  }
  return accum;
}, []);

/**
 * Executes replacements & commands. Any unused (unexecutable) commands remain in the list.
 * @param tokens {Array}
 * @returns {Array}
 */
export const execute = tokens => {
  console.log(tokens);
  return executeCommands(executeReplacements(tokens));
}

/**
 * Replaces tokens with pre-defined strings (e.g. "full stop" => ".")
 * @param tokens {String[]}
 * @returns {String[]}
 */
const executeReplacements = tokens => tokens.map(token => replaceTokens.includes(token) ? tokensRegistry.replacers[token]() : token);

/**
 * Executes commands. Any unused (unexecutable) commands remain in the list.
 * @param tokens {String[]}
 * @returns {String[]}
 */
const executeCommands = tokens =>
  tokens.reduce((acc, token, index, source) => {
    if (commandTokens.includes(token)) {
      acc = tokensRegistry.commands[token](acc, index);
    } else {
      acc.push(token);
    }
    return acc;
  }, []);

/**
 * Encodes (converts) words from the command list in the text to `<${command}>` format
 * @param tokens {String[]} - array of tokens
 * @returns {String[]} - array of tokens where commands are encoded
 */
export const encodeSpecialTokens = tokens => tokens.map(token => (commandTokens.includes(token) || replaceTokens.includes(token)) ? `<${token}>` : token )

const punctuationMarks = [
  "!", ",", ".", ";", "\n", "?",
];

/**
 * Joins tokens. Punctuation is not separated by spaces from the preceding words.
 * @param words {String[]}
 * @returns {String}
 */
export const joinWords = words => words
  .map((word, index, allWords) => punctuationMarks.includes(allWords[index+1]) ? word : word + " ")
  .join("");

const reversedMultiwordTokensDictionary = multiwordTokens.reduce((acc, multiword) => {
  if (acc[multiword[1]]) {
    acc[multiword[1]].push(multiword[0])
  } else {
    acc[multiword[1]] = [multiword[0]];
  }
  return acc;
}, {});
const tokenSecondWords = Object.keys(reversedMultiwordTokensDictionary);

console.log("******************\n", reversedMultiwordTokensDictionary, tokenSecondWords);

/**
 * Splits string into tokens
 * @param {String} string
 * @returns {String[]}
 */
export const splitIntoTokens = string => string
  .split(" ")
  .reduce((accum, word) => {
    if (word.length < 1) return accum; // skip empty words
    const lastIndex = accum.length - 1;
    if (tokenSecondWords.includes(word) && reversedMultiwordTokensDictionary[word].includes(accum[lastIndex])) {
      // if a second word from multiword token is met then append it to previous word
      accum[lastIndex] += " " + word;
    } else {
      accum.push(word);
    }
    return accum;
  }, []);
