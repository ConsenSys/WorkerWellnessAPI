const ReturnHash = require('../returnHash');

describe('ReturnHandler', () => {

    let sut
    let ethereumMgr

    beforeAll(() => {
        ethereumMgr = {
            getGasPrice: jest.fn(),
            getBalance: jest.fn(),
            sendTransaction: jest.fn(),
            makeTx: jest.fn(),
            cb: jest.fn()
        }
        sut = new ReturnHash(ethereumMgr)
    })

    beforeEach(() => {
        ethereumMgr.getGasPrice.mockReturnValue(100)
    })

    test('empty constructor', () => {
        expect(sut).not.toBeUndefined()
    })

    describe('handle', () => {

        test('handle no body', async () => {

            await sut.handle(undefined, null, (err, res) => {
                expect(err).not.toBeNull()
                expect(err.code).toEqual(400)
                expect(err.message).toEqual('no json body')
            })
        })

        test('handle no json body', async () => {

            await sut.handle({
                body: 'notjson'
            }, null, (err, res) => {
                expect(err).not.toBeNull()
                expect(err.code).toEqual(400)
                expect(err.message).toEqual('no json body')
            })
        })

        test('handle no surveyId', async () => {
            let event = {
                body: JSON.stringify({
                    blockchain: "test"
                })
            }
            await sut.handle(event, {}, (err, res) => {
                expect(err).not.toBeNull()
                expect(err.code).toEqual(400)
                expect(err.message).toEqual('surveyId parameter missing')
            })
        })

        test('handle no methodName', async () => {
            let event = {
                body: JSON.stringify({
                    surveyId: "test",
                    report: "{}"
                })
            }
            await sut.handle(event, {}, (err, res) => {
                expect(err).not.toBeNull()
                expect(err.code).toEqual(400)
                expect(err.message).toEqual('methodName parameter missing')
            })
        })

        test('handle no blockchain', async () => {
            let event = {
                body: JSON.stringify({
                    surveyId: "test",
                    report: "{}",
                    methodName: "0x123"
                })
            }
            await sut.handle(event, {}, (err, res) => {
                expect(err).not.toBeNull()
                expect(err.code).toEqual(400)
                expect(err.message).toEqual('blockchain parameter missing')
            })
        })

        // test('handle failed ethereumMgr.makeTx', async () => {
        //     ethereumMgr.makeTx.mockImplementation(() => {
        //         throw ({
        //             message: 'failed'
        //         })
        //     })
        //     let event = JSON.stringify({
        //         surveyId: "test",
        //         report: "test",
        //         workerId: "test",
        //         methodName: "0x123"
        //     })
        //     await sut.handle(event, (err, res) => {
        //         expect(ethereumMgr.makeTx).toBeCalledWith(
        //             JSON.stringify({
        //                 surveyId: "test",
        //                 report: "test",
        //                 workerId: "test",
        //                 methodName: "0x123"
        //             }))
        //         expect(err.code).toEqual(400)
        //         expect(err.message).toEqual('failed')
        //         expect(res).toBeUndefined()

        //     })
        // })

        // test('handle failed txMgr.decode', async () => {
        //     txMgr.decode.mockImplementation(() => {
        //         throw ({
        //             message: 'failed'
        //         })
        //     })
        //     let event = {
        //         body: JSON.stringify({
        //             tx: "0x123456789",
        //             blockchain: 'test'
        //         })
        //     }
        //     await sut.handle(event, {}, (err, res) => {
        //         expect(txMgr.verify).toBeCalledWith('123456789')
        //         expect(txMgr.decode).toBeCalledWith({})
        //         expect(err.code).toEqual(400)
        //         expect(err.message).toEqual('failed')
        //         expect(res).toBeUndefined()

        //     })
        // })

        // test('handle failed tx.from', async () => {
        //     txMgr.decode.mockReturnValue({
        //         from: '0xbad'
        //     })
        //     let event = {
        //         body: JSON.stringify({
        //             tx: validTx,
        //             blockchain: 'test'
        //         })
        //     }
        //     await sut.handle(event, {}, (err, res) => {
        //         expect(err.code).toEqual(403)
        //         expect(err.message).toEqual('Auth token mismatch. Does not match `from` field in tx')
        //         expect(res).toBeUndefined()
        //     })
        // })

        // test('handle failed ethereumMgr.getGasPrice', async () => {
        //     ethereumMgr.getGasPrice.mockImplementation(() => {
        //         throw ({
        //             message: 'failed'
        //         })
        //     })
        //     let event = {
        //         body: JSON.stringify({
        //             tx: "0x123456789",
        //             blockchain: 'test'
        //         })
        //     }
        //     await sut.handle(event, {}, (err, res) => {
        //         expect(err.code).toEqual(500)
        //         expect(err.message).toEqual('failed')
        //         expect(res).toBeUndefined()
        //     })
        // })

        // test('handle failed abusing GasPrice', async () => {
        //     txMgr.decode.mockReturnValue({
        //         gasPrice: 10000,
        //         from: '0x434ed43244205757148ce1f05ffe3778bb40246e'
        //     })
        //     let event = {
        //         body: JSON.stringify({
        //             tx: validTx,
        //             blockchain: 'test'
        //         })
        //     }
        //     await sut.handle(event, {}, (err, res) => {
        //         expect(err.code).toEqual(429)
        //         expect(err.message).toEqual('tx.gasPrice too high. Not funding.')
        //         expect(res).toBeUndefined()
        //     })
        // })

        // test('handle failed ethereumMgr.getBalance', async () => {
        //     ethereumMgr.getBalance.mockImplementation(() => {
        //         throw ({
        //             message: 'failed'
        //         })
        //     })
        //     let event = {
        //         body: JSON.stringify({
        //             tx: "0x123456789",
        //             blockchain: 'test'
        //         })
        //     }
        //     await sut.handle(event, {}, (err, res) => {
        //         expect(err.code).toEqual(500)
        //         expect(err.message).toEqual('failed')
        //         expect(res).toBeUndefined()
        //     })
        // })

        // test('handle failed enough balance', async () => {
        //     ethereumMgr.getBalance.mockReturnValue(1000000)

        //     let event = {
        //         body: JSON.stringify({
        //             tx: validTx,
        //             blockchain: 'test'
        //         })
        //     }
        //     await sut.handle(event, {}, (err, res) => {
        //         expect(err.code).toEqual(429)
        //         expect(err.message).toEqual('enough balance. Not sending funds')
        //         expect(res).toBeUndefined()
        //     })
        // })


        // test('handle failed ethereumMgr.sendTransaction', async () => {
        //     ethereumMgr.getBalance.mockReturnValue(1)
        //     ethereumMgr.sendTransaction.mockImplementation(() => {
        //         throw ({
        //             message: 'failed'
        //         })
        //     })
        //     let event = {
        //         body: JSON.stringify({
        //             tx: validTx,
        //             blockchain: 'test'
        //         })
        //     }
        //     await sut.handle(event, {}, (err, res) => {
        //         //expect(err.code).toEqual(500)
        //         expect(err.message).toEqual('failed')
        //         expect(res).toBeUndefined()
        //     })
        // })

    })
})