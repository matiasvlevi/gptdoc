import fs from "node:fs";
import path from "node:path"
import { File } from './file'
import { makeConfig, Config } from "./config";
import { initOpenAI } from './gpt'
import { Logger } from "./logger";

/** @gpt */
export class Project {

    files: string[];
    is_dir: boolean;

    openai: any;

    config: Config;

    constructor(
        _config_path:string,
        _src_path:string,
        _dest_path:string
    ) {
        this.openai;
        this.is_dir = true;

        if (fs.existsSync(_config_path)) {
            const data = JSON.parse(fs.readFileSync(_config_path, 'utf-8'));
            
            // Overwrite source & dest path if cli args were specified 
            if (_src_path !== undefined) data.files.src = _src_path;
            if (_dest_path !== undefined) data.files.dest = _dest_path;
            
            this.config = makeConfig(data);
        } else {
            this.config = makeConfig({})
        }

        if (!this.config.DEBUG) 
            Logger.log(`Waiting for OpenAI repsonses...`);


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

        this.files = fs.readdirSync(this.config.files.src).filter(x => 
            x.endsWith('.js') || x.endsWith('.ts')
        );
        
        if (!fs.existsSync(this.config.files.dest)) {
            fs.mkdirSync(this.config.files.dest);
        }

    }


    /** @gpt */
    async loadOpenAI() {    
        this.openai = await initOpenAI();
    }


    /** @gpt */
    async generate() {
        if (!this.config.DEBUG && this.openai === undefined) {
            return;
        };

        for (let i = 0; i < this.files.length; i++) {
            let file = new File(
                this.config,
                this.files[i]
            );

            file.parseDocuments();
            
            await file.gptDescribe(this.openai);

            if (this.is_dir)
                await file.writeDir();
            else
                await file.writeFile(this.config.files.dest);    
        }
    }
}