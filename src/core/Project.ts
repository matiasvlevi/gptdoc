import fs from "node:fs";
import path from "node:path"

import { Configuration, OpenAIApi } from 'openai';

import { File } from './File'
import { makeConfig, Config } from "../config/index";

import { Logger } from "../utils/Logger";
import { CLIArgs } from "../cli";

/** @gpt */
export class Project {

    files: string[];
    is_dir: boolean;

    openai: any;

    config: Config;

    tokens: number;

    /** @gpt */
    constructor(
        config: Config
    ) {
        this.openai;
        this.is_dir = true;
        this.tokens = 0;
        this.config = config;

        this.loadOpenAI(config.apiKey);


        if (!fs.existsSync(this.config.files.src)) {
            console.error(`${this.config.files.src} is not a valid source file or directory`);
            process.exit();
        }

        if (!fs.statSync(this.config.files.src).isDirectory()) {
            this.files = [''];
            this.is_dir = false;

            if (this.config.files.dest === './gpt') {
                this.config.files.dest =
                    'gpt.' + path.basename(this.config.files.src)
            }
            
            return;
        }

        this.files = Project.getSourceFilePaths(this.config.files.src, this.config.files.recursive);
        
        if (!fs.existsSync(this.config.files.dest)) {
            fs.mkdirSync(this.config.files.dest);
        }

    }

    static configFromCLI(cli_args: CLIArgs): Config {
        let config_path = (cli_args.options.config || [''])[0];

        if (!fs.existsSync(config_path)) return makeConfig({});

        return makeConfig(
            JSON.parse(fs.readFileSync(config_path, 'utf-8')),
            cli_args
        );
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

    /** @gpt */
    loadOpenAI(apiKey: string) {    
        if (this.config.DEBUG) return;
        
        this.openai = new OpenAIApi(new Configuration({ apiKey }));
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
        // TODO: Change price depending on model
        return (this.tokens/1000) * 0.02; 
    }

    /** @gpt */
    async generate() {
        if (!this.config.DEBUG && this.openai === undefined) {
            return;
        };

        Logger.log(`Waiting for OpenAI repsonses...`);

        for (let i = 0; i < this.files.length; i++) {
            let file = new File(
                this,
                this.files[i]
            );
            file.parseDocuments();
            
            await file.gptDescribe(this.openai);
            
            const dest_file = this.getDestPath(this.files[i]);

            if (this.is_dir)
                await file.writeDir(dest_file);
            else
                await file.writeFile(this.config.files.dest);    
        }

        Logger.token(this.tokens);
    }
}