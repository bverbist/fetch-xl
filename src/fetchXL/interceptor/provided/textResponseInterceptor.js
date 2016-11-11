import {InterceptorBuilder} from '../InterceptorBuilder';
import {TO_TEXT_RESPONSE} from '../interceptorPriorities';
import {propagateResponse} from '../propagateActions';
import {awaitCall} from '../../effect/effectActions';

const textResponseInterceptor = InterceptorBuilder.interceptor('toText')
    .priority(TO_TEXT_RESPONSE)
    .interceptResponse(toText)
    .build();

export default textResponseInterceptor;

function* toText(response) {
    const json = yield awaitCall(response.text);
    yield propagateResponse(json);
}