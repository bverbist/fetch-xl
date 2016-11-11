import runInterceptor from './runInterceptor';
import {CHAIN_ACTION} from '../interceptorChain';
import {isResponseActionType, isErrorActionType} from '../propagateActionTypes';
import fetcher from '../../../fetch/fetcher';

export function runRequestInterceptorsAndCallFetch(requestPropagateAction, interceptorChain, loggers) {
    return new Promise((resolve, reject) => {
        recursiveRunNextInRequestChain([requestPropagateAction, CHAIN_ACTION.NEXT]);

        function recursiveRunNextInRequestChain([propagateAction, chainAction]) {
            if (isResponseActionType(propagateAction)) {
                resolve(propagateAction);
            } else if (isErrorActionType(propagateAction)) {
                reject(propagateAction);
            } else {
                // give input + in one go receive result of following yield
                // This is because next() is asymmetric: It always sends a value to the currently suspended yield, but returns the operand of the following yield.
                const [interceptor, isAtEndOfRequestChain] = interceptorChain.next(chainAction).value;

                // go to the next yield (where the interceptorChain again waits for input)
                interceptorChain.next();

                if (isAtEndOfRequestChain) {
                    resolve(fetcher.fetch(propagateAction.payload));
                } else {
                    runInterceptor(interceptor, propagateAction, loggers)
                        .then(recursiveRunNextInRequestChain);
                }
            }
        }
    });
}

export function runRemainingResponseInterceptors(responseOrErrorPropagateAction, interceptorChain, loggers) {
    return new Promise((resolve) => {
        recursiveRunNextInResponseChain([responseOrErrorPropagateAction]);

        function recursiveRunNextInResponseChain([propagateAction]) {
            // give input + in one go receive result of following yield
            const chainGeneratorResult = interceptorChain.next(CHAIN_ACTION.PREV);

            const [interceptor] = chainGeneratorResult.value;

            const interceptorPromise = runInterceptor(interceptor, propagateAction, loggers);

            if (chainGeneratorResult.done) {
                interceptorPromise
                    .then(([lastPropagateAction]) => {
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