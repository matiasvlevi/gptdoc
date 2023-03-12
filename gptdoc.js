#!/usr/bin/env node
const { Core, Config } = require('./dist/index.js');
/**
 * MAIN
 */
(async () => {
    const config = Config.fromCLI(
        Config.parseArgs([...process.argv.splice(2, process.argv.length)])
    );
    
    const proj = new Core.Project(config);

    await proj.generate();
})();
