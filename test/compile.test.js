const { promises: fs, existsSync } = require('fs');
const compile = require('../lib/compile');
const LANG_CONFIG = require('./po/lang.json');

describe('Compilation should replace the language', () => {
    test('it should compile the translations', async () => {
        await compile();
        expect(existsSync('./test/compile/es_ES.json')).toBe(true);
    });

    for (const { key, lang } of LANG_CONFIG) {
        test(`It should replace ${lang} to ${key} inside ${lang}.json`, () => {
            const {
                headers: { language }
            } = require(`./compile/${lang}.json`);
            expect(language).toBe(key);
        });
    }
});
