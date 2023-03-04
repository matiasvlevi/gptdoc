
export const ES6Function = /\w*\s*\=\s*\(.*\)\s*=>[\s\{\(]+.*[;|\S\n]/gm

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

export const HeaderMatch = /\/\*\*[\s|\*]+Do not modify this file ![\s|\*]*?[\s|\S]*\*\//gm