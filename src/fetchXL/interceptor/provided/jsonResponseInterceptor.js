import InterceptorBuilder from '../InterceptorBuilder';
import {TO_JSON_RESPONSE} from '../interceptorPriorities';
import {propagateResponse} from '../propagateActions';
import {awaitCall} from '../../effect/effectActions';

const jsonResponseInterceptor = InterceptorBuilder.interceptor('toJson')
    .priority(TO_JSON_RESPONSE)
    .interceptResponse(toJson)
    .build();

export default jsonResponseInterceptor;

function* toJson(response) {
    console.log(`jsonResponseInterceptor [${JSON.stringify(response.status)}]`);
    const json = yield awaitCall([response, response.json]);
    console.log(`jsonResponseInterceptor [${JSON.stringify(json)}]`);
    yield propagateResponse(json);
}