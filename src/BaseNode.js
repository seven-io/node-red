const globalThis = require('globalthis')();
const Sms77Client = require('sms77-client');

if (!globalThis.fetch) {
    globalThis.fetch = require('node-fetch');
}

module.exports = function (node, RED, config) {
    try {
        RED.nodes.createNode(node, config);

        node.constructor.CFG = config;
        node.constructor.CLIENT = new Sms77Client(
            RED.nodes.getNode(config.config).credentials.apiKey,
            'node-red');

        node.status({
            fill: 'blue',
            shape: 'ring',
            text: `${node.name} connected`,
        });

        node._done = (done, error, msg) => done
            ? done(error) // Use done if defined (1.0+)
            : node.error(error, msg); // Fallback to node.error (pre-1.0)

        node._emptyStringFallback = (key, value = null) => {
            if (!key in node.constructor.CFG) {
                return value;
            }

            return '' === (node.constructor.CFG[key] || '')
                ? value
                : node.constructor.CFG[key];
        };

        node._errorHandler = (done, msg) => {
            return err => {
                err = err.toString ? err.toString() : JSON.stringify(err);

                return node._done(done, err, msg);
            };
        };

        node._onSuccess = (sent, failed, send, msg, payload, done) => {
            node.status({
                fill: 'yellow',
                shape: 'dot',
                text: `${sent} sent | ${failed} failed`,
            });

            send({...msg, payload});

            if (done) { // Check done exists (1.0+)
                done();
            }
        };

        node.on('input', (msg, send, done) => {
            // If this is pre-1.0, 'send' will be undefined, so fallback to node.send
            send = send ? send : () => node.send.apply(node, arguments);

            node._onInput(msg, send, done);
        });
    } catch (err) {
        console.log({err});

        node.error(err);
    }
};