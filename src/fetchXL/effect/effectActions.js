import {AWAIT_CALL} from './effectActionTypes';
import action from '../../util/action';

export const createEffect = (type, payload) =>
    action(type, payload, ['isEffectAction', true]);

export const awaitCall = (funcToCall, ...callArgs) =>
    createEffect(AWAIT_CALL, {
        funcToCall,
        callArgs
    });