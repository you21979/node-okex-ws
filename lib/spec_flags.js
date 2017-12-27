const BinaryArray = require('binaryarray')

const getMax = (obj) => Object.keys(obj).reduce((r, k) => { return Math.max(obj[k], r) }, 0) + 1
const parse = (strflags, obj, max) => BinaryArray.deserialize(strflags.split("|"), obj, max)

const PUBLIC_SPEC = {
    TICKER : 0,
    DEPTH : 1,
    TRADE : 2,
}

const PUBLIC_SPEC_MAX = getMax(PUBLIC_SPEC)
const parsePublicSpec = (strflags) => parse(strflags, PUBLIC_SPEC, PUBLIC_SPEC_MAX)

module.exports = {
    PUBLIC_SPEC, PUBLIC_SPEC_MAX, parsePublicSpec,
}



