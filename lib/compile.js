const chalk = require('chalk');
const { success, error, spin } = require('./helpers/log')('proton-i18n');

const i18nConfig = require('../po/lang');

const compile = async ({ file, lang }) => {
    const output = `src/i18n/${lang}.json`;
    await execa.shell(`npx angular-gettext-cli --files ${file} --dest ${output} --compile --format json`);
    success(`Compilation done for ${chalk.yellow(lang)}`);
};

async function main() {
    const spinner = spin('Compiles translations');
    try {
        spinner.stop();
        const list = i18nConfig
            .filter(({ key }) => key !== 'en')
            .map(({ key, lang }) => compile({ file: `po/${key}.po`, lang }));

        await Promise.all(list);
        success('Compilation to JSON done');
    } catch (e) {
        spinner.stop();
        throw e;
    }
}

module.exports = main;
