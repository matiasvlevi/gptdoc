import fs from "node:fs";
import path from "node:path"

import { File } from './File'
import { makeConfig, Config } from "../config/index";

import * as Logger from "../utils/Logger";
import { Pricing } from "../gpt";

/** @gpt */
export class Project {

    /**
     * An array holding all the relevant file paths
     */
    files: string[];
    
    /**
     * Wheter or not source is a directory
     */
    is_dir: boolean;

    /**
     * The configuration, a blend of the cli arguments & config file. 
     */
    config: Config;

    /**
     * Token count for price estimation
     */
    tokens: number;

    /** @gpt */
    constructor(
        config: Config
    ) {
        this.is_dir = true;
        this.tokens = 0;
        this.config = config;

        // Abort process if source is not valid
        if (!fs.existsSync(this.config.files.src)) {
            console.error(`${this.config.files.src} is not a valid source file or directory`);
            process.exit();
        }

        // If src is a file
        if (!fs.statSync(this.config.files.src).isDirectory()) {
            this.files = [this.config.files.src];
            this.is_dir = false;

            if (this.config.files.dest === './gpt') {
                this.config.files.dest =
                    'gpt.' + path.basename(this.config.files.src)
            }
            
            return;
        }

        // If src is directory
        this.files = 
            Project.getSourceFilePaths(
                this.config.files.src,
                this.config.files.recursive
            );
        
        // Make destination directory is does not exist
        if (!fs.existsSync(this.config.files.dest)) {
            fs.mkdirSync(this.config.files.dest);
        }

    }

    static readConfigFile(config_path: string): Config {
        if (!fs.existsSync(config_path)) return makeConfig({});

        return makeConfig(
            JSON.parse(fs.readFileSync(config_path, 'utf-8'))
        );
    }

    static getSourceFilePaths(src_path: string, recursive: boolean = true): string[] {
        const files = fs.readdirSync(src_path)
                        .map(x => path.join(src_path, x)); // join with parent dir

        const output: string[] = [];

        for (let fullpath of files) {
            if (fs.statSync(fullpath).isDirectory()) {
                if (!recursive) continue;
                // Is a directory
                output.push(
                    ...Project.getSourceFilePaths(fullpath)
                )
            } else if(
                fullpath.endsWith('.js') || fullpath.endsWith('.ts')
            ) {
                // Is a source file
                output.push(fullpath);
            }
        }

        return output;
    }

    getDestPath(src_path: string): string {
        return src_path.replace(
            (this.config.files.src.match(/\w+/gm) || [''])[0],
            (this.config.files.dest.match(/\w+/gm) || [''])[0]
        );
    }

    addTokens(value: number) {
        this.tokens += value;
    }

    getTokenCost() {
        let price = 0;

        for (let model in Pricing) {
            if (this.config.openai.model.includes(model)) {
                price = Pricing[model];
                break;
            }
        }

        // TODO: Change price depending on model
        return price; 
    }

    /** @gpt */
    async generate() {

        if (this.config.log) 
            Logger.log(`Waiting for OpenAI repsonses...`);

        for (let i = 0; i < this.files.length; i++) {
            if (this.files[i].length <= 0) continue;

            let file = new File(
                this,
                this.files[i]
            );
            file.parseDocuments();
            
            await file.gptDescribe();
            
            const dest_file = this.getDestPath(this.files[i]);

            if (this.is_dir)
                await file.writeDir(dest_file);
            else
                await file.writeFile(this.config.files.dest);    
        }

        if (this.config.log) 
            Logger.token(this.tokens, this.getTokenCost());
    }
}