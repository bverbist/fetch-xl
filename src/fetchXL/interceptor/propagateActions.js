import {REQUEST, RESPONSE, ERROR} from './propagateActionTypes';
import action from '../../util/action';

export function propagateRequest(requestBuilder) {
    return action(REQUEST, requestBuilder);
}

export function propagateResponse(response) {
    return action(RESPONSE, response);
}

export function propagateError(error) {
    return action(ERROR, error);
}
