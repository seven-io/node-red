const Base = require('../Base');

module.exports = function Sms77Sms(RED) {
    RED.nodes.registerType('sms77Sms', function Sms77Node(config) {
        RED.nodes.createNode(this, config);
        this.delivered = 0;
        this.failed = 0;
        this.sent = 0;
        this.sms77Sms = RED.nodes.getNode(config.sms77Sms);
        this.sms77Client = new Base.Sms77Client(this.sms77Sms.credentials.apiKey, 'node-red');
        this.message = config.message;
        this.recipients = config.recipients;
        this.delay = config.delay;
        this.from = config.from;
        this.json = config.json;
        this.buffer = [];

        this.status({shape: 'ring', fill: 'blue', text: this.sms77Sms.name});

        this.on('input', function onInputSMS(node, msg) {
            const text = node.message ? node.message : Base.getMsgProps(msg, 'payload');
            Array.prototype.push.apply(node.buffer,
                (node.recipients ? node.recipients.split(',') : Base.getMsgProps(msg, 'topic').split(','))
                    .map(to => ({text, to,})));

            const elem = node.buffer.shift();

            const smsParams = {text: elem.text, to: elem.to,};
            if (config.from && config.from.length) {
                smsParams.from = config.from;
            }
            if ('json' in config) {
                smsParams.json = 'true' === config.json;
            }
            if (config.delay && config.delay.length) {
                smsParams.delay = config.delay;
            }

            node.sms77Client.sms(smsParams)
                .then(res => {
                    if (100 === Number.parseInt(smsParams.json ? res.success : res)) {
                        node.sent++;

                        node.delivered++;

                        node.log(`${node.sms77Sms.credentials.name} | ${elem.to} | ${elem.text}`);

                        node.send({
                            payload: {
                                text: elem.text,
                                apiKey: node.sms77Sms.credentials.apiKey,
                                to: elem.to,
                                response: res,
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
                        Base.onError(node, res);

                        node.send({
                            payload: {
                                apiKey: node.sms77Sms.credentials.apiKey,
                                response: res,
                                text: elem.text,
                                to: elem.to,
                            }
                        });
                    }
                })
                .catch(err => {
                    Base.onError(node, err.toString());

                    node.send({
                        payload: {
                            apiKey: node.sms77Sms.credentials.apiKey,
                            error: err,
                            to: elem.to,
                            text: elem.text,
                        }
                    });
                });

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