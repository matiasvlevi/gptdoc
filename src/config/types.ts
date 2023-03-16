

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

    /**
     * Whether or not to display the output in the console
     */
    log: boolean;

    /**
     * Whether or not model is a chat model
     */
    chat: boolean;

    /**
     * OpenAI API key, read from a .env file
     */
    apiKey?:string;
}
