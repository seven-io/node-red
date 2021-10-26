const globalThis = require('globalthis')()
if (!globalThis.fetch) globalThis.fetch = require('node-fetch')
const Util = require('./Util')
const NodeUtil = require('./NodeUtil')

module.exports = function(node, RED, config) {
    try {
        RED.nodes.createNode(node, config)

        node.constructor.CFG = config
        node.constructor.CLIENT = Util.initClient(
            RED.nodes.getNode(config.config).credentials.apiKey)

        node.status({fill: 'blue', shape: 'ring', text: `${node.name} connected`})

        node._done = (done, error, msg) => done
            ? done(error) // Use done if defined (1.0+)
            : node.error(error, msg) // Fallback to node.error (pre-1.0)

        node._util = new NodeUtil(node)

        node._emptyStringFallback = node._util.emptyStringFallback

        node._errorHandler = (done, msg) => node._util.errorHandler(done, msg)

        node._onSuccess = node._util.onSuccess

        node.on('input', node._util.onInput)
    } catch (err) {
        console.log({err})

        node.error(err)
    }
}
