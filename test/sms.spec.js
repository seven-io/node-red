const helper = require('node-red-node-test-helper')
const smsNode = require('../src/nodes/sms/sms')

helper.init(require.resolve('node-red'));

describe('sms77-sms Node', function () {
    this.timeout(10000)

    const config = [
        {
            id: 'c1',
            name: 'test config',
            type: 'sms77-config',
        }
    ]

    beforeEach(done => {
        helper.startServer(done);
    });

    afterEach(done => {
        helper.unload()
        helper.stopServer(done);
    })

    it('should be loaded', done => {
        const flow = [
            {
                config,
                id: 'n1',
                name: 'test name',
                type: 'sms77-sms',
            }
        ]
        //console.log(smsNode)
        helper.load(smsNode, flow, {apiKey: ''}, () => {
            const n1 = helper.getNode('n1')
            console.log(n1)
/*
            n1.should.have.property('name', 'test name')*/
            done()
        })
    })

    it('should make payload lower case', done => {
        const flow = [
            {
                id: 'n1',
                name: 'test name',
                type: 'lower-case',
                wires: [['n2']]
            },
            {
                id: 'n2',
                type: 'helper'
            }
        ]
        helper.load(smsNode, flow, () => {
            const n2 = helper.getNode('n2')
            const n1 = helper.getNode('n1')
            n2.on('input', function (msg) {
                msg.should.have.property('payload', 'uppercase')
                done()
            })
            n1.receive({payload: 'UpperCase'})
        })
    })
})