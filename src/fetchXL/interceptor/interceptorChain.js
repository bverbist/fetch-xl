import {sortInterceptorsByAscendingPriority} from './interceptorUtil';

const UNTIL_RETURN = true;
const END_OF_REQUEST_CHAIN = true;
const NOT_END_OF_REQUEST_CHAIN = false;

export const CHAIN_ACTION = {
    NEXT: 'NEXT',
    PREV: 'PREV',
    SAME: 'SAME'
};

export const setupInterceptorChain = (interceptors) => {
    const chain = interceptorChain(interceptors);
    chain.next();
    return chain;
};

function* interceptorChain(interceptors = []) {
    const sortedInterceptors = sortInterceptorsByAscendingPriority(interceptors);

    let currentInterceptorIndex = -1;
    let chainAction;

    while (UNTIL_RETURN) {
        chainAction = yield; // wait for input

        if (chainAction === CHAIN_ACTION.NEXT) {
            currentInterceptorIndex += 1;

            if (currentInterceptorIndex > sortedInterceptors.length) {
                throw new Error('Next chain action not possible: outside the chain boundaries');
            }
        } else if (chainAction === CHAIN_ACTION.PREV) {
            currentInterceptorIndex -= 1;

            if (currentInterceptorIndex < 0) {
                throw new Error('Prev chain action not possible: outside the chain boundaries');
            }
        }

        let endOfRequestChain = END_OF_REQUEST_CHAIN;
        let interceptor = {name: 'no interceptor'};

        if (currentInterceptorIndex !== sortedInterceptors.length) {
            endOfRequestChain = NOT_END_OF_REQUEST_CHAIN;
            interceptor = sortedInterceptors[currentInterceptorIndex];
        }

        if (chainAction === CHAIN_ACTION.PREV && currentInterceptorIndex === 0) {
            return [interceptor, endOfRequestChain];
        }

        yield [interceptor, endOfRequestChain];
    }
}