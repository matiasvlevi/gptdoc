#!/usr/bin/env node
const { Project } = require('./dist/core');
const { parseArgs } = require('./dist/cli');

/**
 * MAIN
 */
(async () => {
    const cli_arg = parseArgs([...process.argv.splice(2, process.argv.length)]);
    
    const proj = new Project(
        Project.configFromCLI(cli_arg)
    );

    await proj.generate();
})();
