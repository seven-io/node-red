const Util = require('./Util')

module.exports = class NodeUtil {
    constructor(node, config) {
        this.node = node
        this.config = config

        this.status(`${node.name} connected`, 'blue', 'ring')
    }

    onDone = (done, error, msg) => done
        ? done(error) // Use done if defined (1.0+)
        : this.node.error(error, msg) // Fallback to node.error (pre-1.0)

    emptyStringFallback = (key, value = '') => {
        const cfg = this.config
        if (!key in cfg) return value
        return '' === (cfg[key] || '') ? value : cfg[key]
    }

    status = (text, fill = 'yellow', shape = 'dot') => {
        this.node.status({fill, shape, text})
    }

    onSuccess = (send, msg, payload, done) => {
        send({...msg, payload})
        if (done) done() // Check done exists (1.0+)
    }

    errorHandler = (done, msg) => {
        return e => this.onDone(done, Util.stringify(e), msg)
    }
}
