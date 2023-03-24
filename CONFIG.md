
# Configuration documentation

Full Documentation [Here](https://rawcdn.githack.com/matiasvlevi/gptdoc/23e675393699c5af956038fae838d775e5b8febf/docs/typedoc/modules/index.html)

## API Key

Add a .env file in your root directory

```env
OPENAI_API_KEY="sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```

or set the OPENAI_API_KEY as a system environement variable. \
Find your api key [here](https://platform.openai.com/account/api-keys)

## Config file 

You can specify a configuration file:

```sh
node node_modules/gptdoc -c .myconfig
```

If none provided, the script will look for `.gptdoc`

Here is a sample configuration file

```json
{
    "DEBUG": false,
    "framework": "JSDOC",
    "language": "TS",
    "tab_size": 4,
    "disableHeader": false,
    "files": {
        "src": "./src",
        "dest": "./gpt",
        "recursive": true
    },
    "openai": {
        "temperature": 0.7,
        "top_p": 1,
        "max_tokens": 256,
        "model": "text-davinci-003"
    },
    "prompt": "Add property tags with @prop",
    "minify": true
}
```

## Config Properties

See [config types](./src/config.ts)

| Property       | type    | description                                                                                |
| -------------- | ------- | ------------------------------------------------------------------------------------------ |
| DEBUG          | boolean | Debug mode allows you to read & write files without prompting the OpenAI API. Placeholder doc comments are written instead.             |
| framework      | string  | A value fed to the model to enforce a documentation framework. ex: `JSDOC`, `typedoc`, `yui-doc` |
| language       | string  | A value fed to the model to enforce a certain language                                       |
| tab_size       | number  | source code's tab size in spaces                                                            |
| prompt         | string  | Additional prompt instructions sent to OpenAI                                                |
| minify         | boolean | whether or not to minify the code sent to OpenAI                                             |
| disableHeader  | boolean | whether or not to disable the header at the top of generated files                           |
| log            | boolean | verbose output in the console                                                                |
| files          | IFileConfig | File configuration                                                                   |
| openai         | IModelConfig | OpenAI configuration                                                                |

#### File Config

IFileConfig

| Property   | type    | description                              |
| ---------- | ------- | ---------------------------------------- |
| src        | string  | The source directory or file             |
| dest       | string  | The destination directory or file        |
| recursive  | boolean | Search files recursively through the source directory |

#### OpenAI Config

IModelConfig

| Property    | type    | description                                                                                                                                                        |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| temperature | number  | Attention to unexpected vocabulary, ranges from 0 to 2                                                                                                            |
| top_p       | number  | Common token distribution, ranges from 0 to 1                                                                                                                      |
| max_tokens  | number  | The maximum number of tokens the model can respond                                                                                                                 |
| model       | string  | model name, refer to [OpenAI API Models Documentations](https://platform.openai.com/docs/models). Use `text-davinci-003` if you don't know which model to use. `gpt-4` is the best model for this case, but it costs a lot more. Keep a Human in the loop, results might not be accurate |




