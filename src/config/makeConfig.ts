import { Config } from './types'
import { CLIArgs } from "../cli";
import { parseEnv } from './parseEnv';
import { Models } from '../models';

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
        DEBUG: cli_arg.options.production ?? _config.DEBUG ?? false,
        disableHeader: _config.disableHeader ?? false,
        tab_size: _config.tab_size || 4,
        framework: _config.framework || 'JSDOC',
        language: _config.language || 'JS',
        prompt: _config.prompt || '',
        minify: _config.minify ?? true,
        chat: ((_config.openai.model in Models) ? Models[_config.openai.model].isChatModel : undefined) ?? _config.chat ?? false,
        openai: {
            temperature: _config.openai.temperature || 0.75,
            top_p: _config.openai.top_p || 1,
            max_tokens: _config.openai.max_tokens || 300,
            model: _config.openai.model || 'text-davinci-003'
        },
        files: {
            src: cli_arg.src || _config.files.src || './src',
            dest: cli_arg.dest || _config.files.dest || './generated-doc',
            recursive: cli_arg.options.recursive ?? _config.files.recursive ?? false
        },
        log: _config.log ?? true,
        apiKey: process.env.OPENAI_API_KEY || parseEnv('.env').OPENAI_API_KEY || ''
    }
};