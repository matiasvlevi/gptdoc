import { CLIArgs } from "./cli";


/** 
 * OpenAI model configuration
 */
export interface IModelConfig {
    /**
     * Attention to unexpected vocabulary, ranges from 0 to 2
     */
    temperature: number;

    /**
     * Common token distribution, ranges from 0 to 1
     */
    top_p: number;

    /**
     * The maximum number of tokens the model can respond
     */
    max_tokens: number;

    /**
     * model name, refer to the OpenAI model documentation
     * @see [OpenAI - Model Documentation](https://platform.openai.com/docs/models). 
     * 
     * Use text-davinci-003 if you don't know which model to use. 
     */
    model: string;
}

/** 
 * File configuration definition
 */
export interface IFileConfig {
    /**
     * The source directory or file
     */
    src: string;

    /**
     * The destination directory or file
     */
    dest: string;

    /**
     * Search files recursively through the source directory
     */
    recursive: boolean;
}

/**
 * Configuration definition
 */
export interface Config {
    /**
     * Debug mode allows you to read & write files without prompting the OpenAI API.
     * Placeholder doc comments are written instead.
     */
    DEBUG: boolean;

    /**
     * A value fed to the model to enforce a documentation framework. 
     * ex: `JSDOC`, `typedoc`, `yui-doc`
     */
    framework: string;

    /**
     * A value fed to the model to enforce a certain language
     */
    language: string;

    /**
     * source code's tab size in spaces
     * Default is 4
     */
    tab_size: number;

    /**
     * Additional prompt instructions sent to OpenAI
     */
    prompt: string;

    /**
     * whether or not to minify the code sent to OpenAI
     */
    minify: boolean;

    /**
     * Whether or not to disable the header message 
     */
    disableHeader: boolean;

    /**
     * OpenAI related configuration
     */
    openai: IModelConfig;

    /**
     * 	File configuration
     */
    files: IFileConfig;
}

/**
 * Takes the first non-undefined value
 * Used mostly for boolean values
 * 
 * @param arr Array of primitives
 * @returns 
 */
function priorize(arr: any[]) {
    for (let i = 0; i < arr.length; i++) {

        if (arr[i] !== undefined)
            return arr[i];
    }
    return arr[arr.length-1];
}

/** 
 * Merge a configuration with the defaults
 * 
 * Defaults are defined here
 */
export function makeConfig(
    _config: any,
    cli_arg: CLIArgs = { options:{} }
): Config {

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