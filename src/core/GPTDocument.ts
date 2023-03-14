import { 
    GptPromptComment,
    ComponentKind,
    JSDOCComment
} from './regex';

import {
    GPT_DEBUG_COMMENT,
    GPT_PROMPT,
    OpenAIChatCompletion,
    OpenAICompletion
} from '../gpt'

import * as Lexer from './Lexer';
import * as Logger from '../utils/Logger';

import { Config } from '../config/types';
import { Project } from './Project';


/** @gpt */
interface GPTResponse {
    description: string
}

/** @gpt */
interface GPTMeta {
    /**
     * The type of the code segment
     * 
     * takes the word before the name
     * ex: 
     *      const 
     *      class
     *      function
     *      async 
     *      
     * TODO: Should have a better mechanism for detecting types 
     */
    kind: string;

    /**
     * The name of the code segment
     */
    name: string;

    /**
     * The indent scope at this position in the source file
     */
    indents: number;
}

/**
 * Represents one Doc comment, with response and meta data
 */
export class GPTDocument {

    /**
     * Response from the model
     */
    response: GPTResponse;

    /**
     * Meta data for the code segment
     */
    meta: GPTMeta;

    /**
     * The source code of the segment
     */
    source: string;

    /**
     * The raw input comment 
     */
    comment: string;

    /**
     * Create a GPTDocument instance.
     * This instance represents 1 documentation comment a GPT Model must fill up.
     * 
     * It holds meta data about the code component, and the response of the model once a request is sent.
     * 
     * @param match The match indicating this is a Documentation comment.
     * @param tab_size The indentation level in which the code component is located.
     */
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

    /**
     * Get a conservative estimate of tokens count
     * 
     * @param text The input text
     * @returns 
     */
    static estimateTokenCount(text: string): number {
        return Math.ceil(text.length / 4);
    }

    /** 
     * Get a description from the GPT Model for a certain function or component
     * 
     * @param source The source file text as a string
     * @param project The project's instance
     * 
     * @returns The source file after this comment description is inserted
     */
    async gptDescribe(source: string, project: Project): Promise<string> {
        let prompt: string = '';
        let prompt_tokens = 0, response_tokens = 0;

        if (project.config.DEBUG) {
            this.response.description = 
                GPT_DEBUG_COMMENT(this.meta.kind, this.meta.name)
        } else {

            // Generate a prompt
            prompt = GPT_PROMPT(project.config, this.meta.kind, this.source);
            prompt_tokens = GPTDocument.estimateTokenCount(prompt);
            
            // Length guard, 
            // do not send a request to OpenAI if prompt is too lengthy
            if (prompt_tokens >= 4000) {
                Logger.error(
                    `Your prompt has ${prompt_tokens} tokens, maximum is 4000`, true
                );
                return source;
            }

            let res;
            if (project.config.chat)
                res = await OpenAIChatCompletion(project.config, prompt);
            else
                res = await OpenAICompletion(project.config, prompt);

            console.log(res)

            if (res.error) {
                Logger.error(res.error.message, true);
                return source;
            }

            // More accurate values for token counts
            prompt_tokens = res.usage.prompt_tokens;
            if (res.usage.completion_tokens) 
                response_tokens = res.usage.completion_tokens;

            if (res.object === 'chat.completion') {
                this.response.description = res.choices[0].message.content || '';
            } else {
                this.response.description = res.choices[0].text || '';
            }

                    // Add a closing state to the comment 
            if (this.response.description.length !== 0)
            this.response.description += '*/';

            // Match a JSDOC comment in response as a safe guard
            const doc_response = 
                this.response.description.match(JSDOCComment);

            if (doc_response === null) {
                // Fall back response
                this.response.description = '/** \n * @gpt \n * GPT Did not generate a comment \n */'
            } else {
                // Set matched comment as response
                this.response.description = doc_response[0];
            }

            // Remove whitespace at the begining
            this.response.description =
                this.response.description.trimStart();

        }

        // Log
        if (project.config.log) {
            Logger.title(this.meta.kind, this.meta.name);
            Logger.response(prompt_tokens, response_tokens, project.getTokenCost());
            Logger.content(this.response.description);
        }

        project.addTokens(prompt_tokens + response_tokens)

        return this.writeGptDoclet(source, project.config);
    }

    /** 
     * Write the GPT Model's response in a given string buffer.
     * 
     * @param source The string buffer
     * @param config The project's configuration
     * 
     * @returns The new string with the GPT response
     */
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