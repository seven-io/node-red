const Base = require('../Base');

module.exports = function Sms77Voice(RED) {
    RED.nodes.registerType('sms77Voice', function Sms77VoiceNode(config) {
        RED.nodes.createNode(this, config);
        this.delivered = 0;
        this.failed = 0;
        this.sent = 0;
        this.sms77Voice = RED.nodes.getNode(config.sms77Voice);
        this.sms77Client = new Base.Sms77Client(this.sms77Voice.credentials.apiKey, 'node-red');
        this.message = config.message;
        this.recipients = config.recipients;
        this.from = config.from;
        this.xml = config.xml;

        this.status({shape: 'ring', fill: 'blue', text: this.sms77Voice.name});

        this.on('input', function onInputVoice(node, msg) {
            const text = node.message ? node.message : Base.getMsgProps(msg, 'payload');

            const recipients = node.recipients ? node.recipients.split(',') : Base.getMsgProps(msg, 'topic').split(',')
                .map(to => ({text, to,})).shift();

            console.log({config, node, text, self: this});

            const voiceParams = {text,};
            if (config.from && config.from.length) {
                voiceParams.from = config.from;
            }
            if ('xml' in config) {
                voiceParams.xml = 'true' === config.xml;
            }

            const responses = [];
            for (const recipient of recipients) {
                console.log({recipient});

                voiceParams.to = recipient;

                node.sms77Client.voice(voiceParams)
                    .then(res => {
                        responses.push(res);

                        if (100 === res.code) {
                            node.sent++;

                            node.delivered++;

                            node.log(`${node.sms77Voice.credentials.apiKey} | ${recipients} | ${text}`);
                        } else {
                            Base.onError(node, res);
                        }
                    })
                    .catch(err => {
                        responses.push(err);

                        Base.onError(node, err.toString());
                    });
            }

            node.status({
                fill: 'yellow',
                shape: 'dot',
                text: `${node.sent}, success: ${node.delivered}, error: ${node.failed}`,
            });

            node.send({
                payload: {
                    apiKey: node.sms77Voice.credentials.apiKey,
                    responses,
                    text,
                    to: recipients,
                }
            });
        }.bind(undefined, this));
    });
};