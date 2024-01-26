/**
 * Removes all preceding tokens until
 * @param tokens {Array}
 * @param index {number}
 */
const undo = (tokens, index) => {
  // for (let)
}

const replacers = {
  "full stop": () => ".",
  "comma": () => ",",
  "exclamation mark": () => "!",
  "question mark": () => "?",
  "dash": () => "-",
  "new line": () => "\n",
};
const replaceTokens = Object.keys(replacers);

export const commands = {
  "backspace": (tokens, position) => {},
  "undo": undo,
  "redo": () => {},
};
const commandTokens = Object.keys(commands);

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
 * Replaces tokens with strings
 * @param tokens {Array}
 * @returns {Array}
 */
const executeReplacements = tokens => tokens.map(token => replaceTokens.includes(token) ? replacers[token]() : token);

/**
 * Executes commands. Any unused (unexecutable) commands remain in the list.
 * @param tokens {Array}
 * @returns {Array}
 */
const executeCommands = tokens =>
  tokens.reduce((acc, token, index, source) => {
    if (commandTokens.includes(token)) {
      acc.push(token);
    } else {
      acc.push(token);
    }
    return acc;
  }, []);

/**
 * Encodes (converts) words from the command list in the text to `<${command}>` format
 * @param tokens {Array} - array of tokens
 * @returns {Array} - array of tokens where commands are encoded
 */
export const encodeSpecialTokens = tokens => tokens.map(token => (commandTokens.includes(token) || replaceTokens.includes(token)) ? `<${token}>` : token )

export const joinTokens = tokens => tokens.join(" ");
