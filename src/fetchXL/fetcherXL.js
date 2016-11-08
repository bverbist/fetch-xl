/* global fetch */

import fetcher from '../fetch/fetcher';
import {setupInterceptorChain, CHAIN_ACTION} from './interceptor/interceptorChain';
import {propagateRequest, propagateResponse, propagateError} from './interceptor/propagateActions';
import {isResponseActionType, isErrorActionType} from './interceptor/propagateActionTypes';
import runInterceptor from './interceptor/runInterceptor';
import verify from '../util/verify';
import is from '../util/is';

const fetch = (requestBuilder) => {
    verify(requestBuilder, is.builder, 'RequestBuilder input should be a builder.');

    const interceptors = is.set(requestBuilder.interceptors) ? requestBuilder.interceptors : [];

    const interceptorChain = setupInterceptorChain(interceptors);

    return new Promise((resolve, reject) => {
        runRequestInterceptorsAndCallFetch(requestBuilder, interceptorChain)
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

function runRequestInterceptorsAndCallFetch(requestBuilder, interceptorChain) {
    return new Promise((resolve, reject) => {
        recursiveRunNextInRequestChain([propagateRequest(requestBuilder), CHAIN_ACTION.NEXT]);

        function recursiveRunNextInRequestChain([propagateAction, chainAction]) {
            console.log(`recursiveRunNextInRequestChain input [${JSON.stringify(propagateAction)}][${chainAction}]`);

            if (isResponseActionType(propagateAction)) {
                resolve(propagateAction);
            } else if (isErrorActionType(propagateAction)) {
                reject(propagateAction);
            } else {
                // give input + in one go receive result of following yield
                // This is because next() is asymmetric: It always sends a value to the currently suspended yield, but returns the operand of the following yield.
                const [interceptor, isAtEndOfRequestChain] = interceptorChain.next(chainAction).value;

                console.log(`recursiveRunNextInRequestChain interceptor [${interceptor.name}]`);

                // go to the next yield (where the interceptorChain again waits for input)
                interceptorChain.next();

                if (isAtEndOfRequestChain) {
                    resolve(fetcher.fetch(propagateAction.payload));
                } else {
                    runInterceptor(interceptor, propagateAction)
                        .then(recursiveRunNextInRequestChain)
                }
            }
        }
    });
}

function runRemainingResponseInterceptors(responseOrErrorPropagateAction, interceptorChain) {
    return new Promise((resolve) => {
        recursiveRunNextInResponseChain([responseOrErrorPropagateAction]);

        function recursiveRunNextInResponseChain([propagateAction]) {
            console.log(`recursiveRunNextInResponseChain input [${JSON.stringify(propagateAction)}]`);

            // give input + in one go receive result of following yield
            const chainGeneratorResult = interceptorChain.next(CHAIN_ACTION.PREV);

            console.log(`recursiveRunNextInResponseChain chain [${JSON.stringify(chainGeneratorResult.value)}]`);
            const [interceptor] = chainGeneratorResult.value;

            console.log(`recursiveRunNextInResponseChain interceptor [${interceptor.name}]`);
            const interceptorPromise = runInterceptor(interceptor, propagateAction);

            if (chainGeneratorResult.done) {
                interceptorPromise
                    .then(([lastPropagateAction]) => {
                        console.log(`recursiveRunNextInResponseChain last [${lastPropagateAction}]`);
                        resolve(lastPropagateAction);
                    });

            } else {
                // go to the next yield (where the interceptorChain again waits for input)
                interceptorChain.next();

                interceptorPromise
                    .then(recursiveRunNextInResponseChain);
            }
        }
    });
}