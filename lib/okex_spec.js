'use strict'

const CONTRACT_TYPES = [
    "this_week",
    "next_week",
    "quarter"
]

const KLINE_SPANS = [
    '1min',
    '3min',
    '5min',
    '15min',
    '30min',
    '1hour',
    '2hour',
    '4hour',
    '6hour',
    '12hour',
    'day',
    '3day',
    'week'
]

const MAX_DEPTH_SIZE = 60

const OKEX_SPEC = {
    CONTRACT_TYPES,
    KLINE_SPANS,
    MAX_DEPTH_SIZE,
}

module.exports = OKEX_SPEC
