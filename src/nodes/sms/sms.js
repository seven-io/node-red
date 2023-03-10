const Util = require('../../Util')
const NodeUtil = require('../../NodeUtil')

module.exports = function (RED) {
    'use strict'

    function Sms77SmsNode(config) {
        RED.nodes.createNode(this, config)

        const node = this
        const nodeUtil = new NodeUtil(node, config)
        const client = Util.initClient(RED, config)

        this.on('input', async function onInput(msg, send, done) {
            if (!send) send = () => node.send.apply(node, [msg, send, done]) // If this is pre-1.0, 'send' will be undefined, so fallback to node.send

            const params = {
                debug: 'true' === config.debug,
                delay: nodeUtil.emptyStringFallback('delay'),
                details: 'true' === config.details,
                flash: 'true' === config.flash,
                foreign_id: nodeUtil.emptyStringFallback('foreign_id'),
                from: nodeUtil.emptyStringFallback('from'),
                json: 'true' === config.json,
                label: nodeUtil.emptyStringFallback('label'),
                no_reload: 'true' === config.no_reload,
                performance_tracking: 'true' === config.performance_tracking,
                text: nodeUtil.emptyStringFallback('message', msg.payload),
                to: nodeUtil.emptyStringFallback('recipients', msg.topic),
                ttl: nodeUtil.emptyStringFallback('ttl'),
                udh: nodeUtil.emptyStringFallback('udh'),
                unicode: 'true' === config.unicode,
                utf8: 'true' === config.utf8,
            }

            try {
                const response = await client.sms(params)
                let code = response
                if (params.json) code = response.success
                else if (params.details) code = response.split('\n')[0]

                const succeeded = [100, 101].includes(Number(code))

                if (!succeeded) return nodeUtil.onDone(done, JSON.stringify(response), msg)

                let failed = 0
                let sent = 1

                if (params.json) {
                    sent = 0

                    for (const msg of response.messages)
                        true === msg.success ? sent++ : failed++
                }

                nodeUtil.status(`${sent} sent | ${failed} failed`)
                nodeUtil.onSuccess(send, msg, response, done)
            } catch (e) {
                nodeUtil.errorHandler(done, msg)(e)
            }
        })
    }

    RED.nodes.registerType('sms77-sms', Sms77SmsNode)
}
