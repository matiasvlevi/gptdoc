/** @gpt */
export class Logger {
    
    /** @gpt */
    static error(text: string) {
        process.stdout.write(
            `\x1b[91mGPTDOC Error:\x1b[0m ${text}\n`
        );
    }

    /** @gpt */
    static log(text: string) {
        process.stdout.write(`${text}\n`);
    }

    /** @gpt */
    static response(kind: string, name: string, description:string) {
        process.stdout.write(
            `Processed \x1b[92m${kind} \x1b[93m${name} \n `+
            `\x1b[90m${description}\x1b[0m\n\n`
        );
    }
}