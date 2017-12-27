const okex = require("..")
const constant = okex.constant
const FuturesPublicStream = okex.FuturesPublicStream

const proc = (btc, eth) => {
    return {
        btc:[btc.asks.reverse()[0], btc.bids[0]],
        eth:[eth.asks.reverse()[0], eth.bids[0]],
    }
}

const update = (fps, time) => {
    if(fps["btc_fps"].connect_status && fps["eth_fps"].connect_status){
        const res = proc(fps["btc_fps"].ctx["quarter"]["depth"], fps["eth_fps"].ctx["quarter"]["depth"])
        console.log(res)
    }
    setTimeout(() => {
        update(fps, time)
    }, time)
}

const main = async () => {
    const btc_fps = new FuturesPublicStream(constant.WS_URL_OKEX_FUTURES_API, "btc", "ticker|depth")
    const eth_fps = new FuturesPublicStream(constant.WS_URL_OKEX_FUTURES_API, "eth", "ticker|depth")
    update({btc_fps,eth_fps}, 1000)
}

main()
