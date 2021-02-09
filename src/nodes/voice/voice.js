const BaseNode = require('../../BaseNode');

module.exports = function (RED) {
    'use strict';

    class Sms77VoiceNode {
        constructor(config) {
            BaseNode(this, RED, config);
        }

        _onInput(msg, send, done) {
            const params = {
                from: this._emptyStringFallback('from'),
                text: this._emptyStringFallback('message', msg.payload),
                to: this._emptyStringFallback('recipients', msg.topic),
                xml: 'true' === Sms77VoiceNode.CFG.xml,
            };

            const successHandler = response => {
                const isValid = 100 === response.code;
                const failed = isValid ? 0 : 1;
                const sent = isValid ? 1 : 0;

                if (!isValid) {
                    return this._done(done, JSON.stringify(response), msg);
                }

                this._onSuccess(sent, failed, send, msg, response, done);
            };

            Sms77VoiceNode.CLIENT.voice(params)
                .then(successHandler)
                .catch(this._errorHandler(done, msg));
        }
    }

    RED.nodes.registerType('sms77-voice', Sms77VoiceNode);
};