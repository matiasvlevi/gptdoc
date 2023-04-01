import fs from 'node:fs'

/**
 * Parse a .env file
 * 
 * @param path The .env file path
 * @returns 
 */
export function parseEnv(path: string): { [key:string]: any } {

    if (!fs.existsSync(path)) {
        // Return an undefined key, 
        // The OPENAI api will reject the key,  
        // error is handled when the response is recieved
        return { OPENAI_API_KEY: undefined }
    }

    // Get the .env file as an array of strings (line by line)
    const lines = fs.readFileSync(path, 'utf-8').split('\n');

    const config: { [key:string]: any } = {};

    lines.forEach(line => {
        // If no `=` char found, skip line
        if (!line.includes('=')) return;

        // Get variable name and value content
        const [variable, value]: string[] = line.split('=');

        // Get text inside double quotes
        const match = value.match(/(?<=[\'\"]).*(?=[\'\"])/gm);
        
        // If no double quotes, use raw value
        if (match === null) 
            config[variable] = value;
        else 
            config[variable] = match[0];
    
    });

    return config;
}