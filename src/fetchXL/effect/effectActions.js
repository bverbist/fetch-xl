import {AWAIT_CALL} from './effectActionTypes';
import {effectAction} from './effectActionHandler';

export const awaitCall = (funcToCall, ...callArgs) =>
    effectAction(AWAIT_CALL, {
        funcToCall,
        callArgs
    });