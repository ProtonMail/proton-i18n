const { bash, curl } = require('./cli');
const { spin, success, debug, warn } = require('./log')('proton-i18n');
const { getFiles, getCrowdin } = require('../../config');

const { KEY_API, FILE_NAME, PROJECT_NAME } = getCrowdin();

const getURL = (scope, flag = '') => {
    const customFlag = flag ? `&${flag}` : '';
    return `https://api.crowdin.com/api/project/${PROJECT_NAME}/${scope}?key=${KEY_API}${customFlag}`.trim();
};

// async function curl(urlScope, { body = '', headers = {} }) {
//     const url = getURL(urlScope);
//     // Escape the body.
//     return bash(
//         `curl -X POST -H 'Content-type: application/json' --data "${body
//             .replace(/"/g, '\\"')
//             .replace(/`/g, '\\`')}" ${url}`
//     );
// }

// function uploadFile(file, { form }) {
// //   curl -i -X POST -H "Content-Type: multipart/form-data"
// // -F "data=@test.mp3"
//   const queryString = new URLSearchParams(new FormData(form)).toString();

//   curl \
//   -F "files[/directory/strings.xml]=@strings.xml" \
//   https://api.crowdin.com/api/project/{project-identifier}/update-file?key={project-key}

// }

async function checkStatusExport() {
    const { stdout = '' } = await curl(getURL('export-status', 'json'));
    debug(stdout, 'Check status export');
    return JSON.parse(stdout);
}

async function createExport() {
    const request = curl(getURL('export'));

    // In can take a lot of time
    setTimeout(() => {
        console.log('Cancel request');
        request.cancel();
    }, 5000);

    try {
        await request;
    } catch (error) {
        if (!error.isCanceled) {
            throw error;
        }
    }
}

async function download() {
    const { stdout } = await curl(getURL('download/all.zip'), { encoding: null });
    return stdout;
}

async function getStatus() {
    const { stdout = '' } = await curl(getURL('status', 'json'));
    debug(stdout, 'get status ouput');
    return JSON.parse(stdout);
}

async function getTopMember() {
    const { stdout = '' } = await curl(getURL('reports/top-members/export', 'format=csv&json'));
    debug(stdout, 'hash export top-members');
    const { hash, success } = JSON.parse(stdout);

    if (success) {
        const { stdout } = await curl(getURL('reports/top-members/download', `hash=${hash}`));
        debug(stdout, 'CSV export top-members');
        return stdout;
    }

    warn('export top-members is not available for now');
}

module.exports = {
    download,
    getStatus,
    createExport,
    getTopMember,
    checkStatusExport
};
