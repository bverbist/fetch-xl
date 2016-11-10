import runInterceptor from './runInterceptor';
import {CHAIN_ACTION} from '../interceptorChain';
import {isResponseActionType, isErrorActionType} from '../propagateActionTypes';
import fetcher from '../../../fetch/fetcher';

export function runRequestInterceptorsAndCallFetch(requestPropagateAction, interceptorChain) {
    return new Promise((resolve, reject) => {
        recursiveRunNextInRequestChain([requestPropagateAction, CHAIN_ACTION.NEXT]);

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
                        .then(recursiveRunNextInRequestChain);
                }
            }
        }
    });
}

export function runRemainingResponseInterceptors(responseOrErrorPropagateAction, interceptorChain) {
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