#!/usr/bin/env node
const { Project } = require('./dist/index');
const { parseArgs } = require('./dist/cli');

/**
 * MAIN
 */
(async () => {
    const cli_arg = parseArgs([...process.argv.splice(2, process.argv.length)]);

    const proj = new Project(
        cli_arg.options.config[0],
        cli_arg
    );

    if (!proj.config.DEBUG) {
        await proj.loadOpenAI();
    }

    await proj.generate();
})();
