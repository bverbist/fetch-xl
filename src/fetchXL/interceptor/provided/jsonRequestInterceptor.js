import {InterceptorBuilder} from '../InterceptorBuilder';
import {TO_JSON_BODY} from '../interceptorPriorities';
import {propagateRequest} from '../propagateActions';
import is from '../../../util/is';

const jsonRequestInterceptor = InterceptorBuilder.interceptor('bodyToJson')
    .priority(TO_JSON_BODY)
    .interceptRequest(bodyToJson)
    .build();

export default jsonRequestInterceptor;

function* bodyToJson(requestBuilder) {
    const body = requestBuilder.body;

    if (is.set(body)) {
        requestBuilder.body(JSON.stringify(body));
    }

    yield propagateRequest(requestBuilder);
}