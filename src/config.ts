import { CLIArgs } from "./cli";

/** @gpt */
export interface IModelConfig {
    temperature: number;
    top_p: number;
    max_tokens: number;
    model: string;
}

/** @gpt */
export interface IFileConfig {
    src: string;
    dest: string;
    recursive: boolean;
}

/** @gpt */
export interface Config {
    openai: IModelConfig;
    files: IFileConfig;

    tab_size: number;
    DEBUG: boolean;
    disableHeader: boolean;

    framework: string;
    language: string;

    minify: boolean;

    prompt: string;
}

function priorize(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {

        if (arr[i] !== undefined)
            return arr[i];
    }
    return arr[arr.length-1];
}

/** @gpt */
export function makeConfig(_config: any, cli_arg: CLIArgs = {options:{}}): Config {
    if (_config.openai === undefined) 
        _config.openai = {};
    
    if (_config.files === undefined) 
        _config.files = {};

    return {
        DEBUG: priorize([cli_arg.options.production,_config.DEBUG, false]),
        disableHeader: priorize([_config.disableHeader, false]),
        tab_size: _config.tab_size || 4,
        framework: _config.framework || 'JSDOC',
        language: _config.language || 'JS',
        prompt: _config.prompt || '',
        minify: _config.minify || true,
        openai: {
            temperature: _config.openai.temperature || 0.75,
            top_p: _config.openai.top_p || 1,
            max_tokens: _config.openai.max_tokens || 300,
            model: _config.openai.model || 'text-davinci-003'
        },
        files: {
            src: cli_arg.src || _config.files.src || './src',
            dest: cli_arg.dest || _config.files.dest || './generated-doc',
            recursive: priorize([cli_arg.options.recursive, _config.files.recursive, false])
        }
    }
};