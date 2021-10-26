const Sms77Client = require('sms77-client')

module.exports = class Util {
    static initClient(apiKey) {
        return new Sms77Client(apiKey, 'node-red')
    }

    static stringify(value) {
        if (typeof value === 'string') return value
        if (typeof value.toString === 'function') return value.toString()
        return JSON.stringify(value)
    }
}
