const okex = require("..")
const constant = okex.constant
const FuturesPublicStream = okex.FuturesPublicStream

const update = (fps, time) => {
    if(fps.connect_status){
        console.log(fps.ctx["quarter"]["ticker"])
    }
    setTimeout(() => {
        update(fps, time)
    }, time)
}

const main = async () => {
    const btc_fps = new FuturesPublicStream(constant.WS_URL_OKEX_FUTURES_API, "btc", "ticker|depth")
    update(btc_fps, 1000)
}

main()
