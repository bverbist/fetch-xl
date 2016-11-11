import is from '../../util/is';

export const AWAIT_CALL = 'AWAIT_CALL';

export const isEffectAction = (act) =>
    is.action(act) && act.isEffectAction === true;
