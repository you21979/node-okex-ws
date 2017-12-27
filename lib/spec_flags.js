const BinaryArray = require('binaryarray')

const getMax = (obj) => Object.keys(obj).reduce((r, k) => { return Math.max(obj[k], r) }, 0) + 1

const PUBLIC_SPEC = {
    TICKER : 0,
    DEPTH : 1,
    TRADE : 2,
}

const PUBLIC_SPEC_MAX = getMax(PUBLIC_SPEC)

const parsePublicSpec = (strflags) => {
    const flags = strflags.split("|")
    const ba = BinaryArray.deserialize(flags, PUBLIC_SPEC, PUBLIC_SPEC_MAX)
    return ba
}

module.exports = {
    PUBLIC_SPEC, PUBLIC_SPEC_MAX, parsePublicSpec,
}



