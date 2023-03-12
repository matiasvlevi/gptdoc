/**
 * 
 * Computes the number of indents before a string
 * 
 * @param tab_size 
 * @param method_source 
 * @returns the number of indents before a string 
 */
export function countTabs(tab_size: number, method_source: string): number {
    let i = 0, count = 0;
    while(
        /\s/.test(method_source[i]) 
    ) {
        if (/ /.test(method_source[i])) count++;
        i++;
    }
    return count/tab_size;
}

/**
 * Generate a whitespace string 
 * 
 * @param count The number of spaces in the whitespace
 * @returns 
 */
export function getWhitespace(count: number): string {
    return new Array(count).fill(' ').join('');
}

/**
 * Add indentation to a multiline string segment
 * 
 * @param indent_count The number of indents to add to a 
 * @param tab_size The size of a tab in spaces
 * @param doc_source The source string
 * @param separator Sepecify what defines a line separation
 * @returns 
 */
export function addIndent(
    indent_count: number,
    tab_size: number,
    doc_source: string,
    separator: string = '\n'
) {
    const lines = doc_source.split(separator);
    return lines.map((line, i) => {
        if (i == 0 || i == lines.length-1) 
            return line; 
        
        return getWhitespace(indent_count * tab_size) + line;
    }).join('\n');
}

/**
 * Get the contents of a function definition
 * 
 * @param start_index The character index of the start of the function definition in source
 * @param source The source string with a function definition
 * 
 * @returns The function definition
 */
export function getDefinition(start_index: number, source: string): string {
    let i = start_index;
    let scope = 0;
    let passed = false;

    // TODO: Detect if is es6 function

    // Iterate through characters to get the end character index of the
    // function definition
    while (
        (scope !== 0 || !passed) &&
        i < source.length
    ) {
        if (source[i] === '{') {
            scope++;
            passed = true;
        } else if (source[i] === '}'){
            scope--;
        }
        i++;
    }

    return source.slice(start_index, i);
}
