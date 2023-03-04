export interface IModelConfig {
    temperature: number;
    top_p: number;
    max_tokens: number;
    model: string;
}

export interface IFileConfig {
    src: string;
    dest: string;
}

export interface Config {
    openai: IModelConfig;
    files: IFileConfig;

    tab_size: number;
    DEBUG: boolean;
    disableHeader: boolean;

    framework: string;
    language: string;
}

export function makeConfig(_config: any): Config {
    return {
        DEBUG: _config.DEBUG || false,
        disableHeader: _config.disableHeader || false,
        tab_size: _config.tab_size || 4,
        framework: _config.framework || 'JSDOC',
        language: _config.language || 'JS',
        openai: {
            temperature: _config.openai.temperature || 0.75,
            top_p: _config.openai.top_p || 1,
            max_tokens: _config.openai.max_tokens || 300,
            model: _config.openai.model || 'text-davinci-003'
        },
        files: {
            src: _config.files.src || './src',
            dest: _config.files.dest || './generated-doc'
        }
    }
};