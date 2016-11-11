import is from '../../util/is';

export const REQUEST = 'REQUEST';
export const RESPONSE = 'RESPONSE';
export const ERROR = 'ERROR';

export const isRequestActionType = (action) =>
    action.type === REQUEST;

export const isResponseActionType = (action) =>
    action.type === RESPONSE;

export const isErrorActionType = (action) =>
    action.type === ERROR;

export const isPropagateAction = (act) =>
    is.action(act) && (isRequestActionType(act) || isResponseActionType(act) || isErrorActionType(act));