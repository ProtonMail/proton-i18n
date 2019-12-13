const path = require('path');
const execa = require('execa');
const { debug } = require('./log')('proton-i18n');

const bash = (cli, args = [], stdio) => {
    debug({ cli, args, stdio }, 'bash');
    return execa(cli, args, { shell: '/bin/bash', stdio });
};

const curl = (url, opt = {}) => {
    debug({ url, opt }, 'curl');
    return execa(`curl '${url}'`, [], { shell: '/bin/bash', ...opt });
};

// 'inherit'
const script = (cli, args = [], stdio) => {
    const cmd = path.resolve(__dirname, '..', '..', 'scripts', cli);
    return bash(cmd, args, stdio);
};

module.exports = { bash, script, curl };
