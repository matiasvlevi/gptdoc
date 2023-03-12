import fs from 'node:fs'

/**
 * Parse a .env file
 * 
 * @param path The .env file path
 * @returns 
 */
export function parseEnv(path: string): { [key:string]: any } {
    const file = fs.readFileSync(path, 'utf-8');
    const lines = file.split('\n');

    const config: { [key:string]: any } = {};

    lines.forEach(line => {
        if (!line.includes('=')) return;

        const [variable, value]: string[] = line.split('=');

        const match = value.match(/(?<=[\'\"]).*(?=[\'\"])/gm);
        
        if (match === null) 
            config[variable] = value;
        else 
            config[variable] = match[0];
    
    });

    return config;
}