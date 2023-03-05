
# Configuration documentation



## API Key

Add a `.env` file in your root directory

```env
OPENAI_API_KEY="sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```

or set the `OPENAI_API_KEY` as a system environement variable.

find your API key [here](https://platform.openai.com/account/api-keys)

<br/><br/>

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

<br/>

## Config Properties

<table>

<tr>
<th align="center"> Property </th> 
<th align="center"> type </th>
<th align="center"> description </th>
</tr>

<tr><td>DEBUG</td><td>boolean</td><td>Debug mode allows you to read & write files without prompting the OpenAI API. Placeholder doc comments are written instead.</td></tr>
<tr><td>framework</td><td>string</td><td>A value fed to the model to enforce a documentation framework. ex: `JSDOC`, `typedoc`, `yui-doc`</td></tr>
<tr><td>language</td><td>string</td><td>A value fed to the model to enforce a certain language</td></tr>
<tr><td>tab_size</td><td>number</td><td>source code's tab size in spaces</td></tr>
<tr><td>prompt</td><td>string</td><td>Additional prompt instructions sent to OpenAI</td></tr>
<tr><td>minify</td><td>boolean</td><td>whether or not to minify the code sent to OpenAI</td></tr>

<tr><td>files</td><td>object</td><td>File configuration</td></tr>
<tr><td>openai</td><td>object</td><td>OpenAI configuration</td></tr>


</table>
<br/>

#### File Config

<table>

<tr>
<th align="center"> Property </th> 
<th align="center"> type </th>
<th align="center"> description </th>
</tr>

<tr>
    <td>src</td>
    <td>string</td>    
    <td>The source directory or file</td>
</tr>
<tr>
    <td>dest</td>
    <td>string</td>
    <td>The destination directory or file</td>
</tr>
<tr>
    <td>recursive</td>
    <td>boolean</td>
    <td>The source directory or file</td>
</tr>

</table>

<br/>


#### OpenAI Config

<table>

<tr>
<th align="center"> Property </th> 
<th align="center"> type </th>
<th align="center"> description </th>
</tr>

<tr>
    <td>temperature</td>
    <td>number</td>
    <td>Attention to unexpected vocabulary, ranges from 0 to 2</td>
</tr>
<tr>
    <td>top_p</td>
    <td>number</td>    
    <td>Common token distribution, ranges from 0 to 1</td>
</tr>
<tr>
    <td>max_tokens</td>
    <td>number</td>
    <td>The maximum number of tokens the model can respond</td>
</tr>
<tr>
    <td>model</td>
    <td>string</td>
    <td>
        model name, refer to <a href="https://platform.openai.com/docs/models">OpenAI API Models Documentations</a>.
        Use <code>text-davinci-003</code> if you don't know which model to use. 
    </td>
</tr>

</table>

<br/>


