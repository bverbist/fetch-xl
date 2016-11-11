import {isAction} from './action';

const is = {
    undefined: (val) => typeof val === 'undefined',
    null: (val) => val === null,
    set: (val) => !is.undefined(val) && !is.null(val),
    function: (func) => typeof func === 'function',
    number: (nr) => typeof nr === 'number',
    array: (arr) => Array.isArray(arr),
    promise: (prom) => prom && is.function(prom.then),
    iterator: (iter) => iter && is.function(iter.next) && is.function(iter.throw),
    action: isAction,
    builder: (bldr) => bldr && is.function(bldr.build),
    logger: (logr) => logr && is.function(logr.log)
};

export default is;