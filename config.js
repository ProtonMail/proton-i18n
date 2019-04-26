const path = require('path');
const { error } = require('./lib/helpers/log')('proton-i18n');

const CONFIG = {
    ENV_FILE: 'env/.env',
    OUTPUT_JSON_LANG: 'src/i18n/',
    OUTPUT_I18N_DIR: path.join(process.cwd(), 'po'),
    CACHE_LANG: 'po/lang.json',
    OUTPUT_PO: 'po/template.pot',
    PROTON_DEPENDENCIES: ['src/app'].concat(
        ['react-components/{co*,helpers}', 'proton-shared/lib'].map((name) => `node_modules/${name}`)
    )
};

const getTemplate = (fullPath) => {
    const file = process.env.OUTPUT_PO || CONFIG.OUTPUT_PO;
    return !fullPath ? file : path.join(CONFIG.OUTPUT_I18N_DIR, file);
};
const getNameCrowdinFile = () => process.env.CROWDIN_FILE_NAME;
const getProjectName = () => process.env.CROWDIN_PROJECT_NAME;
const checkEnvKey = () => {
    if (!process.env.CROWDIN_KEY_API || !process.env.CROWDIN_FILE_NAME || !process.env.CROWDIN_PROJECT_NAME) {
        const keys = ['CROWDIN_KEY_API', 'CROWDIN_FILE_NAME', 'CROWDIN_PROJECT_NAME'].join(' - ');
        error(new Error(`Missing one/many mandatory keys from the .env ( cf the Wiki): \n${keys}`));
    }
};

const getEnv = () => ({
    CROWDIN_KEY_API: process.env.CROWDIN_KEY_API,
    CROWDIN_FILE_NAME: process.env.CROWDIN_FILE_NAME,
    CROWDIN_PROJECT_NAME: process.env.CROWDIN_PROJECT_NAME,
    APP_KEY: process.env.APP_KEY
});

CONFIG.getTemplate = getTemplate;
CONFIG.getProjectName = getProjectName;
CONFIG.getNameCrowdinFile = getNameCrowdinFile;
CONFIG.checkEnvKey = checkEnvKey;
CONFIG.getEnv = getEnv;

module.exports = CONFIG;
