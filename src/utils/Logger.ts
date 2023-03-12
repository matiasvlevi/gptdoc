/** @gpt */
export function error(text: string, exit: boolean = false) {
    process.stdout.write(
        `\x1b[91mGPTDOC Error:\x1b[0m ${text}\n`
    );

    if (exit) process.exit();
}

/** @gpt */
export function log(text: string) {
    process.stdout.write(`${text}\n`);
}

export function title(kind: string, name: string) {
    process.stdout.write(
        `\nProcessed \x1b[92m${kind} \x1b[93m${name} \x1b[0m\n\n`
    );
}

/** @gpt */
export function response(prompt_tokens: number, response_tokens:number, price: number) {
    process.stdout.write(
        `Prompt tokens:   ~\x1b[92m${prompt_tokens}\x1b[0m\n`+
        `Response tokens: ~\x1b[92m${response_tokens}\x1b[0m\n`
    );
    token(prompt_tokens + response_tokens, price);
}

export function content(text:string) {
    process.stdout.write(
        `\nResponse: \n`+
        `\x1b[90m${text}\x1b[0m\n\n`
    );
}

/** @gpt */
export function token(total_tokens: number, price: number, title:string = 'Total') {
    process.stdout.write(
        `${title} tokens:    ~\x1b[92m${total_tokens}\x1b[0m\n`+
        `Price:           ~\x1b[92m${Math.round((total_tokens/1000) * price * 100000)/100000}$USD\x1b[0m\n`
    );
}
