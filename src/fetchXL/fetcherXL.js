/* global fetch */

import {setupInterceptorChain} from './interceptor/interceptorChain';
import {
    runRequestInterceptorsAndCallFetch,
    runRemainingResponseInterceptors
} from './interceptor/run/runInterceptorChain';
import {propagateRequest, propagateResponse, propagateError} from './interceptor/propagateActions';
import {isResponseActionType} from './interceptor/propagateActionTypes';
import verify from '../util/verify';
import is from '../util/is';

const fetch = (requestBuilder) => {
    verify(requestBuilder, is.builder, 'RequestBuilder input should be a builder.');

    const interceptors = is.set(requestBuilder.interceptors) ? requestBuilder.interceptors : [];

    const interceptorChain = setupInterceptorChain(interceptors);

    return new Promise((resolve, reject) => {
        runRequestInterceptorsAndCallFetch(propagateRequest(requestBuilder), interceptorChain)
            .then((response) =>
                runRemainingResponseInterceptorsAndResolveOrRejectBasedOnTheLastInterceptorResult(
                    propagateResponse(response)
                )
            )
            .catch((error) =>
                runRemainingResponseInterceptorsAndResolveOrRejectBasedOnTheLastInterceptorResult(
                    propagateError(error)
                )
            );

        function runRemainingResponseInterceptorsAndResolveOrRejectBasedOnTheLastInterceptorResult(
            responseOrErrorPropagateAction
        ) {
            runRemainingResponseInterceptors(responseOrErrorPropagateAction, interceptorChain)
                .then(resolveOrRejectPromiseBasedOnLastPropagateAction);
        }

        function resolveOrRejectPromiseBasedOnLastPropagateAction(responseOrErrorPropagateAction) {
            if (isResponseActionType(responseOrErrorPropagateAction)) {
                resolve(responseOrErrorPropagateAction.payload);
            } else {
                reject(responseOrErrorPropagateAction.payload);
            }
        }
    });
};

export default {fetch};