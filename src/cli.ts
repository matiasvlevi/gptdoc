import { Map } from './types';

/** @gpt */
interface Option {
    argc: number;
    type: string;
}

/** @gpt */
const CLIOptions: Map<Option> = {
    'config': {
        argc: 1,
        type: 'string'
    },
    'recursive':  {
        argc: 0,
        type: 'flag'
    },
    'data':  {
        argc: 1,
        type: 'string'
    }
}

/** @gpt */
export function parseArgs(args: string[]) {
    const options: Map<any> = {
        config: [ ]
    };

    // Iterate through arguments
    for (let a = 0; a < args.length; a++) {
        // Iterate through options
        if (args[a][0] !== '-') continue;
        for (let option_name in CLIOptions) {

            // If is option
            if (
                args[a] === `-${option_name[0]}` ||
                args[a] === `--${option_name}` 
            ) {
                if (CLIOptions[option_name].type === 'flag') {
                    options[option_name] = true;
                    break;
                }

                if (options[option_name] === undefined) 
                    options[option_name] = [];

                for (let i = 0; i < CLIOptions[option_name].argc; i++) {

                    // Removes next argument and push it to the option arguments
                    options[option_name].push(
                        args.splice(a+1, 1)[0] 
                    );
                }
                
                // Remove option tag
                args.splice(a, 1);
            }
        }
    }

    if (options.config.length === 0)
        options.config.push('.gptdoc');

    return {
        options,
        src: args[0],
        dest: args[1]
    }
}

