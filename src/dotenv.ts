import fs from 'node:fs'
import { Map } from './types';

/** @gpt */
export default function parseEnv(path: string) {
    const file = fs.readFileSync(path, 'utf-8');
    const lines = file.split('\n');

    const config: Map<any> = {};

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