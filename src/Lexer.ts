


/** @gpt */
export class Lexer {

    /** @gpt */
    static countTabs(tab_size: number, method_source: string) {
        let i = 0, count = 0;
        while(
            /\s/.test(method_source[i]) 
        ) {
            if (/ /.test(method_source[i])) count++;
            i++;
        }
        return count/tab_size;
    }

    /** @gpt */
    static getWhitespace(count: number) {
        return new Array(count).fill(' ').join('');
    }

    /** @gpt */
    static addIndent(indent_count: number, tab_size: number, doc_source: string) {
        const lines = doc_source.split('\n');
        return lines.map((line, i) => {
            if (i == 0 || i == lines.length-1) 
                return line; 
            
            return Lexer.getWhitespace(indent_count * tab_size) + line;
        }).join('\n');
    }

    /** @gpt */
    static getDefinition(start_index: number, source: string) {
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
}
