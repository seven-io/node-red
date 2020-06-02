const globalThis = require('globalthis')();

if (!globalThis.fetch) {
    globalThis.fetch = require('node-fetch');
}

module.exports = {
    getMsgProps: (msg, props) => props.split('.').reduce((obj, i) => obj[i], msg),
    globalThis,
    onError: (node, err) => {
        node.failed++;

        console.error(err);
    },
    Sms77Client: require('sms77-client'),
};