const Util = require('../../Util')
const NodeUtil = require('../../NodeUtil')

module.exports = function (RED) {
    'use strict'

    function Sms77LookupNode(config) {
        RED.nodes.createNode(this, config)

        const node = this
        const nodeUtil = new NodeUtil(node, config)
        const client = Util.initClient(RED, config)

        this.on('input', async function onInput(msg, send, done) {
            if (!send) send = () => node.send.apply(node, [msg, send, done]) // If this is pre-1.0, 'send' will be undefined, so fallback to node.send

            const type = config.lookupType
            const params = {
                json: 'true' === config.json,
                number: nodeUtil.emptyStringFallback('numbers', msg.topic),
                type,
            }

            try {
                const response = await client.lookup(params)
                nodeUtil.status(`Lookup of type "${type}" performed.`)
                send({...msg, payload: response})
                if (done) done() // Check done exists (1.0+)
            } catch (e) {
                nodeUtil.errorHandler(done, msg)(e)
            }
        })
    }

    RED.nodes.registerType('sms77-lookup', Sms77LookupNode)
}
