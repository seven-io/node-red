const Util = require('./Util')

module.exports = class NodeUtil {
    constructor(node) {
        this.node = node
    }

    emptyStringFallback = (key, value = null) => {
        const cfg = this.node.constructor.CFG
        if (!key in cfg) return value
        return '' === (cfg[key] || '') ? value : cfg[key]
    }

    status = (text, fill = 'yellow', shape = 'dot') => {
        this.node.status({fill, shape, text})
    }

    onSuccess = (sent, failed, send, msg, payload, done) => {
        this.status(`${sent} sent | ${failed} failed`)
        send({...msg, payload})
        if (done) done() // Check done exists (1.0+)
    }

    onInput = async (msg, send, done) => {
        if (!send) send = () => this.node.send.apply(this.node, [msg, send, done]) // If this is pre-1.0, 'send' will be undefined, so fallback to node.send
        await this.node._onInput(msg, send, done)
    }

    errorHandler = (done, msg) => {
        return e => this.node._done(done, Util.stringify(e), msg)
    }
}
