const BaseNode = require('../../BaseNode')

module.exports = function(RED) {
    'use strict'

    class Sms77VoiceNode {
        constructor(config) {
            BaseNode(this, RED, config)
        }

        async _onInput(msg, send, done) {
            const params = {
                from: this._emptyStringFallback('from'),
                json: 'true' === Sms77VoiceNode.CFG.json,
                text: this._emptyStringFallback('message', msg.payload),
                xml: 'true' === Sms77VoiceNode.CFG.xml,
            }
            const recipients = this._emptyStringFallback('recipients', msg.topic)

            for (const to of recipients.split(',')) {
                try {
                    const response = await Sms77VoiceNode.CLIENT.voice({...params, to})
                    const code = params.json ? response.success : response.split('\n')[0]
                    const succeeded = ['100', '101'].includes(code)

                    if (!succeeded) return this._done(done, JSON.stringify(response), msg)

                    let failed = 0
                    let sent = 1

                    if (params.json) {
                        sent = 0

                        for (const msg of response.messages)
                            true === msg.success ? sent++ : failed++
                    }

                    this._onSuccess(sent, failed, send, msg, response, done)
                } catch (e) {
                    this._errorHandler(done, msg)(e)
                }
            }
        }
    }

    RED.nodes.registerType('sms77-voice', Sms77VoiceNode)
}
