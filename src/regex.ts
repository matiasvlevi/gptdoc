
/**
 * match 1 - Component Name
 * group 1 - Component kind
 */
export const ComponentKind = /(?<=\s*(\w*)\s)\w*(?=[\s*?]?[\{|\=|\(|\<])/gm;

/**
 * match 1 - The comment and the function declaration
 * group 1 - GPT empty Comment boilerplate
 * group 2 - 1st keyword
 * group 3 - 2nd keyword
 * group 4 - Name
 */
export const GptPromptComment = /(\/\*\*[\*|\s|\w]*?@gpt[\S|\s]*?\*\/)\s([^>]*?.\s(\w*)\s*(\(|=|\{|\<))/gm;

/**
 * Match a jsdoc comment
 * 
 * match 1 - A jsdoc comment
 */
export const JSDOCComment = /\/\*\*[\*|\s|\w]*[\S|\s]*?\*\//gm


/**
 * Match a file header comment
 */
export const HeaderMatch = /\/\*\*[\s|\*]+Do not modify this file ![\s|\*]*?[\s|\S]*\*\//gm

/**
 * Match an es6 function
 * 
 * TODO: Refactor, some edge cases are not taken into account
 */
export const ES6Function = /\w*\s*\=\s*\(.*\)\s*=>[\s\{\(]+.*[;|\S\n]/gm

