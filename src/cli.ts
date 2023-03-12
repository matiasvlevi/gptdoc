
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
export const CLIOptions: { [key:string]: Flag } = {
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

