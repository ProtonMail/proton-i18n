#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const dedent = require('dedent');
const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));

const CONFIG = require('./config');
const { error, debug } = require('./lib/helpers/log')('proton-i18n');

require('dotenv').config({ path: CONFIG.ENV_FILE });

const is = (command) => argv._.includes(command);

async function main() {
    debug(CONFIG.getEnv());

    if (is('crowdin')) {
        await require('./lib/crowdin')();
    }

    if (is('commit')) {
        await require('./lib/commit')(argv._[1]);
    }

    if (is('extract')) {
        await require('./lib/extract')(argv._[1]);
    }

    if (is('validate')) {
        require('./lib/validate')(argv._[1], { dir: argv._[2] });
    }

    if (is('compile')) {
        require('./lib/compile')();
    }

    if (is('list')) {
        require('./lib/cache').write(argv._[1]);
    }

    if (is('upgrade')) {
        // Add custom limit if we don't use custom
        require('./lib/upgrade')(
            [
                !argv.custom && {
                    title: 'Get list of translations available',
                    task: () =>
                        require('./lib/crowdin')({
                            type: true,
                            list: true,
                            limit: argv['limit-i18n'] || 90,
                            outputLang: true
                        })
                },
                {
                    title: 'Upgrade our translations with ones from crowdin',
                    task: () =>
                        require('./lib/crowdin')({
                            sync: true
                        })
                },
                {
                    title: 'Store a cache of translations available in the app',
                    task: () => require('./lib/cache').write()
                },
                {
                    title: 'Export translations as JSON',
                    task: () => require('./lib/compile')()
                },
                {
                    title: 'Commit translations',
                    task: () => require('./lib/commit')('upgrade')
                }
            ].filter(Boolean)
        );
    }

    if (is('help') && !is('crowdin')) {
        const file = fs.readFileSync(path.join(__dirname, 'help'), 'utf8');
        const content = file.replace(/\[(\w+)\](<\w+>|\w+)\[\/\w+\]/g, (match, g1, g2) => {
            return chalk[g1](g2);
        });
        console.log(content);
    }
}

main().catch(error);
