import { Map } from './types';

/** 
 * Configuration coming from the CLI arguments
 * 
 * This configuration has more authority than the json configuration
 */
export interface CLIArgs {
    /**
     * Option flags
     */
    options: Options;
    
    /** 
     * The source directory or file
     */
    src?:  string;

    /**
     * The destination directory or file
     */
    dest?: string;
}

/**
 * Defines Option flags parsed from the CLI arguments
 */
export interface Options {
    /**
     * Configuration paths
     */
    config?: string[];

    /**
     * Whether or not to search recursively through the source directory
     */
    recursive?: boolean;

    /**
     * Whether or not to force non-debug mode
     */
    production?: boolean;
}

/** 
 * Defines a CLI Flag
 */
interface Flag {
    /**
     * The number of arguments this flag takes in
     */
    argc: number;

    /**
     * The type of the argument 
     * ex: `string`, `flag`
     */
    type: string;

    /**
     * Whether or not the flag is an active low
     * 
     * Used with `flag` types
     */
    activelow?: boolean;
}

/**
 * The defined flag options
 */
const CLIOptions: Map<Flag> = {
    'config': {
        argc: 1,
        type: 'string'
    },
    'recursive':  {
        argc: 0,
        type: 'flag',
        activelow: false
    },
    'production':  {
        argc: 0,
        type: 'flag',
        activelow: true
    }
}

/**
 * Parse command line arguments
 * 
 * Relies on `CLIOptions` which holds the data for different flags
 * 
 * Config comes out by default with `.gptdoc` as a config directory
 * 
 * @param args relevant arguments from process.argv (remove first 2 arguments)
 * 
 * @returns parsed output
 */
export function parseArgs(args: string[]): CLIArgs {
    const options: Map<any> = { config: [] };

    // Iterate through arguments
    for (let a = 0; a < args.length; a++) {

        // If argument is not an option, skip
        if (args[a][0] !== '-') continue;
        
        // Iterate through options
        for (let option_name in CLIOptions) {

            // If is not option current option, skip
            if (
                args[a] !== `-${option_name[0]}` &&
                args[a] !== `--${option_name}` 
            ) continue;

            // If is a flag
            if (CLIOptions[option_name].type === 'flag') {

                // Change boolean state
                options[option_name] = !(CLIOptions[option_name].activelow);
                break;
            }

            // Define option arguments if none exist
            if (options[option_name] === undefined) 
                options[option_name] = [];

            // Get all arguments (mostly 0 or 1)
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

    // Add default config path if none found
    if (options.config.length === 0)
        options.config.push('.gptdoc');
        
    return {
        options,
        src: args[0],
        dest: args[1]
    }
}

