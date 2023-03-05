import { 
    GptPromptComment,
    ComponentKind,
    JSDOCComment
} from './regex';

import { 
    GPT_COMPLETION_CONFIG,
    GPT_DEBUG_COMMENT,
    GPT_PROMPT
} from './gpt'

import { Lexer } from './Lexer';
import { Config } from './config';
import { Logger } from './logger';
import { Project } from './Project';


/** @gpt */
interface GPTResponse {
    description: string
}

/** @gpt */
interface GPTMeta {
    kind: string;
    name: string;
    indents: number;
}

/** @gpt */
export class GPTDocument {
    response: GPTResponse;
    meta: GPTMeta;
    source: string;
    comment: string;

    /** @gpt */
    constructor(match: RegExpMatchArray, tab_size: number) {

        this.comment = match[1];

        this.source = Lexer.getDefinition(
            (match.index || 0) + this.comment.length, // Start index
             match.input || ''                        // source
        );
        
        const name_match = Array.from(this.source.matchAll(ComponentKind))[0] || ['', ''];
        this.response = {
            description: ''
        }

        this.meta = {
            kind: (name_match[1].length === 0) ?  'method': name_match[1],
            name: name_match[0] || '',
            indents: Lexer.countTabs(tab_size, this.source)
        };
    }

    /** @gpt */
    async gptDescribe(openai: any, source: string, project: Project): Promise<string> {
        let prompt: string = '';

        if (project.config.DEBUG) {
            this.response.description = 
                GPT_DEBUG_COMMENT(this.meta.kind, this.meta.name)
        } else {
            /**
             * Call to openAI's API
             */
            prompt = GPT_PROMPT(project.config, this.meta.kind, this.source);

            const res = await openai.createCompletion(
                GPT_COMPLETION_CONFIG(project.config, prompt)
            );

            this.response.description = 
                res.data.choices[0].text || '';

            // Add a closing state to the comment 
            if (this.response.description.length !== 0)
                this.response.description += '*/';

            const doc_response = this.response.description.match(JSDOCComment);

            if (doc_response === null) {
                this.response.description = '/** \n * @gpt \n * GPT Did not generate a comment \n */'
            } else {
                this.response.description = doc_response[0];
            }

            // Remove whitespace at the begining
            this.response.description =
                this.response.description.trimStart();


        }
        
        Logger.response(this.meta.kind, this.meta.name, prompt, this.response.description);
        
        project.addTokens(this.response.description.length/4);
        project.addTokens(prompt.length/4);

        return this.writeGptDoclet(source, project.config);
    }

    /** @gpt */
    writeGptDoclet(source: string, config: Config): string {
        const matches = source.matchAll(GptPromptComment);
        let parsed: Array<string> = [];

        // Select relevant generic Doc match
        Array.from(matches).forEach(match => {
            if (match[3] === this.meta.name) 
                parsed = match;
        });

        // Return source as is if no comment to replace found
        if (parsed.length === 0) return source;

        // Replace with GPT response
        return source.replace(
            parsed[0],
            Lexer.addIndent(
                this.meta.indents, config.tab_size,
                this.response.description + '\n' + parsed[2]
            )
        ) || '';
    }

}