#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));

const CONFIG = require('./config');
const { error, debug } = require('./lib/helpers/log')('proton-i18n');
const renderHelp = require('./lib/helpers/help');

const is = (command) => argv._.includes(command);

async function main() {
    debug(CONFIG.getEnv(), 'ENV');

    if (is('post-install')) {
        await require('./lib/postInstall')();
    }
    if (is('crowdin')) {
        await require('./lib/crowdin').update();
    }

    if (is('extract')) {
        await require('./lib/extract')(argv._[1]);
    }

    if (is('validate')) {
        require('./lib/validate')(argv._[1], { dir: argv._[2] });
    }

    if (is('help') && !is('crowdin')) {
        renderHelp();
    }
}

main().catch(error);
