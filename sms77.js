module.exports = function (RED) {
    'use strict';

    const Sms77Client = require('sms77-client');
    const globalThis = require('globalthis')();
    const fetch = require('node-fetch');

    if (!globalThis.fetch) {
        globalThis.fetch = fetch;
    }

    const getMsgProps = (msg, props) => props.split('.').reduce((obj, i) => obj[i], msg);

    RED.nodes.registerType('sms77', function Sms77Node(config) {
        RED.nodes.createNode(this, config);
        this.delivered = 0;
        this.failed = 0;
        this.sent = 0;
        this.sms77 = RED.nodes.getNode(config.sms77);
        this.sms77Client = new Sms77Client(this.sms77.credentials.apiKey, 'node-red');
        this.message = config.message;
        this.numbers = config.numbers;
        this.delay = config.delay;
        this.from = config.from;
        this.buffer = [];

        this.status({shape: 'ring', fill: 'blue', text: this.sms77.name});

        this.on('input', function onInputSMS(node, msg) {
            const self = this;

            const text = node.message ? node.message : getMsgProps(msg, 'payload');
            Array.prototype.push.apply(node.buffer,
                (node.numbers ? node.numbers.split(',') : getMsgProps(msg, 'topic').split(','))
                    .map(to => ({text, to,})));

            const elem = node.buffer.shift();

            const onError = err => {
                node.failed++;

                console.error(err);

                node.send({payload: err});
            };

            const smsParams = {text: elem.text, to: elem.to,};
            if (config.from && config.from.length) {
                smsParams.from = config.from;
            }
            if ('json' in config) {
                smsParams.json = "true" === config.json;
            }
            if (config.delay && config.delay.length) {
                smsParams.delay = config.delay;
            }

            node.sms77Client.sms(smsParams)
                .then(res => {
                    if (100 === Number.parseInt(smsParams.json ? res.success : res)) {
                        node.sent++;

                        node.delivered++;

                        node.log(node.sms77.credentials.apiKey + ' | ' + elem.to + ' | ' + elem.text);

                        node.send({
                            payload: {
                                text: elem.text,
                                apiKey: node.sms77.credentials.apiKey,
                                to: elem.to,
                            }
                        });

                        if (node.buffer.length === 0) {
                            node.status({
                                fill: 'yellow',
                                shape: 'dot',
                                text: `${node.sent}, success: ${node.delivered}, error: ${node.failed}`,
                            });
                        }
                    } else {
                        onError(res.success);
                    }
                })
                .catch(err => onError(err.toString()));

            if (node.buffer.length > 0) {
                node.status({fill: 'grey', shape: 'dot', text: `${node.buffer.length} pending`,});
            }
        }.bind(undefined, this));

        this.on('close', function () {
            this.buffer = [];
        });
    });

    RED.nodes.registerType('sms77Config', function Sms77ConfigNode(config) {
            RED.nodes.createNode(this, config);

            this.name = config.name;
        },
        {credentials: {apiKey: {type: 'text',}},});
};