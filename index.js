#!/usr/bin/env node

const dedent = require('dedent');
const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));
const CONFIG = require('./config');

require('dotenv').config({ path: CONFIG.ENV_FILE });

const { error, debug } = require('./lib/helpers/log')('proton-i18n');

const is = (command) => argv._.includes(command);

async function main() {
    debug(CONFIG.getEnv());

    if (is('crowdin')) {
        await require('./lib/crowdin')();
    }

    if (is('extract')) {
        await require('./lib/extract')();
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

    if (is('help')) {
        console.log(dedent`
        Usage: $ proton-i18n <command>
        Available commands:
          - ${chalk.blue('crowdin')}
              To update, download etc. translations (--help to get more details)

          - ${chalk.blue('validate')} ${chalk.blue('<type>')}
              To validate the translations, check if we have contexts
                - type: default (default) validate we don't have missing context
                - type: lint-functions check if we use the right format for ttag

          - ${chalk.blue('extract')}
              Extract all translations from the projet

          - ${chalk.blue('list')} ${chalk.blue('<type>')}
              List all translations available
                - type: default (default) write them inside a file po/lang.json
                - type: show print JSON inside the console

          - ${chalk.blue('compile')}
              Compile all translations from the dir ./po to a JSON inside src/i18n/<lang>.json
    `);
    }
}

main().catch(error);
