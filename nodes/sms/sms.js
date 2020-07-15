const BaseNode = require('../../BaseNode');

module.exports = function (RED) {
    'use strict';

    class Sms77SmsNode {
        constructor(config) {
            BaseNode(this, RED, config);
        }

        _onInput(msg, send, done) {
            const params = {
                delay: this._emptyStringFallback('delay'),
                from: this._emptyStringFallback('from'),
                json: 'true' === Sms77SmsNode.CFG.json,
                text: this._emptyStringFallback('message', msg.payload),
                to: this._emptyStringFallback('recipients', msg.topic),
                debug: 'true' === Sms77SmsNode.CFG.debug,
                details: 'true' === Sms77SmsNode.CFG.details,
                foreign_id: this._emptyStringFallback('foreign_id'),
                flash: 'true' === Sms77SmsNode.CFG.flash,
                label: this._emptyStringFallback('label'),
                no_reload: 'true' === Sms77SmsNode.CFG.no_reload,
                performance_tracking: 'true' === Sms77SmsNode.CFG.performance_tracking,
                ttl: this._emptyStringFallback('ttl'),
                udh: this._emptyStringFallback('udh'),
                unicode: 'true' === Sms77SmsNode.CFG.unicode,
                utf8: 'true' === Sms77SmsNode.CFG.utf8,
            };

            const successHandler = response => {
                const code = params.json ? response.success : response;
                const isValid = 100 === parseInt(code);

                let failed = 0;
                let sent = params.json ? 0 : 1;

                if (!isValid) {
                    return this._done(done, JSON.stringify(response), msg);
                }

                if (params.json) {
                    for (const msg of response.messages) {
                        true === msg.success ? sent++ : failed++;
                    }
                }

                this._onSuccess(sent, failed, send, msg, response, done);
            };

            Sms77SmsNode.CLIENT.sms(params)
                .then(successHandler)
                .catch(this._errorHandler(done, msg));
        }
    }

    RED.nodes.registerType('sms77-sms', Sms77SmsNode);
};