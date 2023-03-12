/** @gpt */
export function error(text: string) {
    process.stdout.write(
        `\x1b[91mGPTDOC Error:\x1b[0m ${text}\n`
    );
}

/** @gpt */
export function log(text: string) {
    process.stdout.write(`${text}\n`);
}

/** @gpt */
export function response(kind: string, name: string, prompt: string, description:string) {
    process.stdout.write(
        `\nProcessed \x1b[92m${kind} \x1b[93m${name} \x1b[0m\n\n`
    );

    process.stdout.write(
        `Prompt tokens:   ~\x1b[92m${prompt.length/4}\x1b[0m\n`+
        `Response tokens: ~\x1b[92m${description.length/4}\x1b[0m\n`
    );
    token((prompt.length + description.length)/4);

    process.stdout.write(
        `\nResponse: \n`+
        `\x1b[90m${description}\x1b[0m\n\n`
    );
}

/** @gpt */
export function token(total_tokens: number, title:string = 'Total') {
    process.stdout.write(
        `${title} tokens:    ~\x1b[92m${total_tokens}\x1b[0m\n`+
        `Price:           ~\x1b[92m${Math.round((total_tokens/1000) * 0.02 * 100000)/100000}$USD\x1b[0m\n`
    );
}