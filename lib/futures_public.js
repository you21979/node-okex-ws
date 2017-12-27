'use strict'
const WebSocket = require('ws')
const builder = require('./cmd_builder')
const okspec = require('./okex_spec')
const flags = require('./spec_flags')

const initializeSpec = (self, strflags) => {
    const support_list = []
    const ba = flags.parsePublicSpec(strflags.toUpperCase())
    if(ba.at(flags.PUBLIC_SPEC.TICKER)){
        support_list.push('ticker')
    }
    if(ba.at(flags.PUBLIC_SPEC.DEPTH)){
        support_list.push('depth')
    }
    if(ba.at(flags.PUBLIC_SPEC.TRADE)){
        support_list.push('trade')
    }
    return support_list
}

class FuturesPublicStream {
    constructor(url, symbol, strflags){
        this.url = url
        this.is_reconnect = true
        this.connect_status = 0
        this.symbol = symbol
        this.depth_size = okspec.MAX_DEPTH_SIZE
        this.support_spec = initializeSpec(this, strflags || "ticker")
        this.ctx = initializeContext(this)
        this.channel_tbl = initializeChannelTable(this)
        this.ws = initializeStream(this)
    }
    dispatch(name, contract_type) {
        if(!this.support_spec.includes(name)){
            // drop data
            return (data) => {
            }
        }
        switch(name){
        default:
            return defaultStorage(this, contract_type, name)
        }
    }
    onConnected() {
        console.log("connected: " + this.url)
        this.connect_status = 1
        okspec.CONTRACT_TYPES.forEach(contract_type => {
            this.support_spec.forEach( spec => {
                addChannel( this.ws, this.channel_tbl[contract_type][spec], this.dispatch( spec, contract_type ) )
            })
        })
    }
    onClosed() {
        console.log("closed")
        this.ws = null
        this.connect_status = 0
        if(this.is_reconnect){
            this.ws = initializeStream(this)
        }
    }
    onUpdated() {
        this.ctx.uptime = process.uptime()
    }
    close() {
        if(this.ws){
            this.ws.close()
        }
    }
}
const addChannel = (ws, channel, subscriber) => {
    const event_name = 'addChannel'
    if(subscriber){
        ws.on(channel, subscriber)
    }
    return ws.send(JSON.stringify({
        event : event_name,
        channel : channel,
    }))
}

const initializeStream = (self) => {
    const ws = new WebSocket(self.url);
    ws.on('open', () => {
        self.onConnected()
    });
    ws.on('message', (data) => {
        const msg = JSON.parse(data)
        msg.forEach(v => {
            ws.emit(v.channel, v.data)
        })
    });
    ws.on('close', () => {
        self.onClosed()
    });
    ws.on('error', (e) => {
        ws.close()
    });
    return ws
}

const initializeContext = (self) => {
    return okspec.CONTRACT_TYPES.reduce((r, v)=> {
        r[v] = {}
        self.support_spec.forEach(k => { r[v][k] = { lastupdate : 0 } })
        return r
    }, {uptime : 0})
}

const initializeChannelTable = (self) => {
    return okspec.CONTRACT_TYPES.reduce((r, contract_type)=> {
        r[contract_type] = getChannel(self, contract_type)
        return r
    }, {})
}

const defaultStorage = (self, contract_type, name) => {
    return (data) => {
        data.lastupdate = process.uptime()
        self.ctx[contract_type][name] = data
        self.onUpdated()
    }
}

const getChannel = (self, contract_type) => {
    const keycurrency = "usd"
    const kline = okspec.KLINE_SPANS.reduce((r, span) => {
        r['kline_' + span] = builder.kline(keycurrency, self.symbol, contract_type, span)
        return r
    }, {})
    return Object.assign({
        ticker : builder.ticker(keycurrency, self.symbol, contract_type),
        trade : builder.trade(keycurrency, self.symbol, contract_type),
        depth : builder.depth_full(keycurrency, self.symbol, contract_type, self.depth_size),
    }, kline)

}

module.exports = FuturesPublicStream

