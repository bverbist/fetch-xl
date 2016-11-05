import {AWAIT_CALL} from './effectActionTypes';
import is from '../../util/is';
import verify from '../../util/verify';

const handleAwaitCall = (payload) => {
    if (is.array(payload.funcToCall)) {
        const [thisContext, func] = payload.funcToCall;
        return func.apply(thisContext, payload.callArgs);
    }

    return payload.funcToCall(payload.callArgs);
};

const effectHandler = {
    [AWAIT_CALL]: handleAwaitCall
};

export const handleEffect = (effectAction) => {
    const effectResult = effectHandler[effectAction.type](effectAction.payload);
    return Promise.resolve(effectResult);
};

const addHandler = (effectActionType, payloadHandlerFn) => {
    verify(payloadHandlerFn, is.function, `The payloadHandlerFn for the effect action type ${effectActionType} should be a function.`);

    effectHandler[effectActionType] = payloadHandlerFn;
};

export default {addHandler};