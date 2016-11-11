const is = {
    undefined: (val) => typeof val === 'undefined',
    null: (val) => val === null,
    set: (val) => !is.undefined(val) && !is.null(val),
    function: (func) => typeof func === 'function',
    number: (nr) => typeof nr === 'number',
    string: (nr) => typeof nr === 'string',
    array: (arr) => Array.isArray(arr),
    promise: (prom) => is.set(prom) && is.function(prom.then) && is.function(prom.catch),
    iterator: (iter) => is.set(iter) && is.function(iter.next) && is.function(iter.throw),
    action: (act) => is.set(act) && is.string(act.type) && is.set(act.payload),
    builder: (bldr) => is.set(bldr) && is.function(bldr.build),
    logger: (lggr) => is.set(lggr) && is.function(lggr.log)
};

export default is;