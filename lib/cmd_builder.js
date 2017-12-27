'use strict';

const depth_incremental = ( quote, symbol, contract ) =>
    ["ok","sub","future", symbol, "depth", contract, quote].join("_")

const ticker = ( quote, symbol, contract ) =>
    ["ok","sub","future" + quote, symbol, "ticker", contract].join("_")

const depth_full = ( quote, symbol, contract, size ) =>
    ["ok","sub","future" + quote, symbol, "depth", contract, size].join("_")

const kline = ( quote, symbol, contract, timespan ) =>
    ["ok","sub","future" + quote, symbol, "kline", contract, timespan].join("_")

const trade = ( quote, symbol, contract ) =>
    ["ok","sub","future" + quote, symbol, "trade", contract].join("_")

exports.ticker = ticker
exports.depth_full = depth_full
exports.depth_incremental = depth_incremental
exports.kline = kline
exports.trade = trade

