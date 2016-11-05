import {isAction} from '../../util/action';

export const AWAIT_CALL = 'AWAIT_CALL';

export const isEffectAction = (act) =>
    isAction(act) && act.isEffectAction === true;
