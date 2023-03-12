import fs from 'node:fs'

import { Config } from "./types";
import { CLIArgs } from "../cli";
import { makeConfig } from "./makeConfig";

export function fromCLI(cli_args: CLIArgs): Config {
    let config_path = (cli_args.options.config || [''])[0];

    if (!fs.existsSync(config_path)) return makeConfig({});

    return makeConfig(
        JSON.parse(fs.readFileSync(config_path, 'utf-8')),
        cli_args
    );
}