const BaseNode = require('../../BaseMessageNode')
const Util = require('../../Util')

module.exports = function(RED) {
    'use strict'

    class Sms77LookupNode {
        constructor(config) {
            BaseNode(this, RED, config)
        }

        async _onInput(msg, send, done) {
            const params = {
                json: 'true' === Sms77LookupNode.CFG.json,
                number: this._emptyStringFallback('numbers', msg.topic),
                type: Sms77LookupNode.CFG.lookupType,
            }

            try {
                const response = await Sms77LookupNode.CLIENT.lookup(params)
                this._util.status(Util.stringify(response))
                send({...msg})
                if (done) done() // Check done exists (1.0+)
            } catch (e) {
                this._errorHandler(done, msg)
            }
        }
    }

    RED.nodes.registerType('sms77-lookup', Sms77LookupNode)
}
