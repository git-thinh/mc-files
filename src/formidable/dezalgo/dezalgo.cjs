var wrappy = require('./wrappy.cjs')
module.exports = wrappy(dezalgo)

var asap = require('./asap.cjs')

function dezalgo(cb) {
    var sync = true
    asap(function () {
        sync = false
    })

    return function zalgoSafe() {
        var args = arguments
        var me = this
        if (sync)
            asap(function () {
                cb.apply(me, args)
            })
        else
            cb.apply(me, args)
    }
}