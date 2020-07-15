module.exports = function (RED) {
    function Sms77ConfigNode(config) {
        RED.nodes.createNode(this, config);

        this.apiKey = config.apiKey;
        this.name = config.name;
    }

    RED.nodes.registerType('sms77-config', Sms77ConfigNode, {
        credentials: {
            apiKey: {
                type: 'password',
            },
        },
    });
};