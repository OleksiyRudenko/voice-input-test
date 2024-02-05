export const extractInt = str => parseInt(str.replace(/[~\D]+/,""));

const firstCharRegExp = /\S/;
export const capitalize = str => str.replace(firstCharRegExp, char => char.toUpperCase());

const twoLineRegExp = /\n\n/g;
const oneLineRegExp = /\n/g;
export const linebreakHTMLize = str => str.replace(twoLineRegExp, '<p></p>').replace(oneLineRegExp, '<br>');
