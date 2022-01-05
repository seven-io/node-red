const BaseNode = require('../../BaseMessageNode');

module.exports = function (RED) {
    'use strict';

    class Sms77SmsNode {
        constructor(config) {
            BaseNode(this, RED, config);
        }

        _onInput(msg, send, done) {
            const params = {
                debug: 'true' === Sms77SmsNode.CFG.debug,
                delay: this._emptyStringFallback('delay'),
                details: 'true' === Sms77SmsNode.CFG.details,
                flash: 'true' === Sms77SmsNode.CFG.flash,
                foreign_id: this._emptyStringFallback('foreign_id'),
                from: this._emptyStringFallback('from'),
                json: 'true' === Sms77SmsNode.CFG.json,
                label: this._emptyStringFallback('label'),
                no_reload: 'true' === Sms77SmsNode.CFG.no_reload,
                performance_tracking: 'true' === Sms77SmsNode.CFG.performance_tracking,
                text: this._emptyStringFallback('message', msg.payload),
                to: this._emptyStringFallback('recipients', msg.topic),
                ttl: this._emptyStringFallback('ttl'),
                udh: this._emptyStringFallback('udh'),
                unicode: 'true' === Sms77SmsNode.CFG.unicode,
                utf8: 'true' === Sms77SmsNode.CFG.utf8,
            };

            Sms77SmsNode.CLIENT.sms(params)
                .then(response => {
                    let code = response
                    if (params.json) code = response.success
                    else if (params.details) code = response.split('\n')[0]

                    const succeeded = [100, 101].includes(Number(code));

                    if (!succeeded) return this._done(done, JSON.stringify(response), msg);

                    let failed = 0;
                    let sent = 1;

                    if (params.json) {
                        sent = 0

                        for (const msg of response.messages)
                            true === msg.success ? sent++ : failed++;
                    }

                    this._onSuccess(sent, failed, send, msg, response, done);
                })
                .catch(this._errorHandler(done, msg));
        }
    }

    RED.nodes.registerType('sms77-sms', Sms77SmsNode);
};
