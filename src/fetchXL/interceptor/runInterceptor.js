import {REQUEST, RESPONSE, ERROR, isPropagateAction} from './propagateActionTypes';
import {CHAIN_ACTION} from './interceptorChain';
import {propagateError} from './propagateActions';
import {runIteratorAndReturnPromiseThatResolvesWithTheIteratorsLastValue} from '../iterator/runIterator';
import is from '../../util/is';
import verify from '../../util/verify';

const INTERCEPT_FUNCTION = {
    [REQUEST]: 'interceptRequest',
    [RESPONSE]: 'interceptResponse',
    [ERROR]: 'interceptResponseError'
};

const runInterceptor = (interceptor, prevPropagateAction) => {
    const interceptFunction = INTERCEPT_FUNCTION[prevPropagateAction.type];

    return new Promise((resolve) => {
        if (!is.set(interceptor[interceptFunction])) {
            const propagateAction = prevPropagateAction;
            resolvePropagateActionWithItsChainAction(propagateAction);
        } else {
            try {
                runIteratorAndReturnPromiseThatResolvesWithTheIteratorsLastValue(
                    interceptor[interceptFunction](prevPropagateAction.payload)
                ).then((propagateAction) => {
                    verifyIsPropagateAction(propagateAction, interceptFunction);
                    verifyPropagateActionTypeAllowedAfterPrevType(prevPropagateAction, propagateAction);
                    resolvePropagateActionWithItsChainAction(propagateAction);
                });
            } catch (error) {
                const propagateAction = propagateError(error);
                resolvePropagateActionWithItsChainAction(propagateAction);
            }
        }

        function resolvePropagateActionWithItsChainAction(propagateAction) {
            const chainAction = determineChainDirectionByResultLastInterceptor(prevPropagateAction, propagateAction);
            resolve([propagateAction, chainAction]);
        }
    });
};

export default runInterceptor;

function determineChainDirectionByResultLastInterceptor(prevPropagateAction, propagateAction) {
    switch (propagateAction.type) {
        case REQUEST:
            return CHAIN_ACTION.NEXT;
        case RESPONSE:
            if (wasPrevPropagateActionTypeRequest()) {
                return CHAIN_ACTION.SAME;
            }
            return CHAIN_ACTION.PREV;
        case ERROR:
            if (wasPrevPropagateActionTypeRequest()) {
                return CHAIN_ACTION.SAME;
            }
            return CHAIN_ACTION.PREV;
        default:
            throw new Error(`Unexpected propagate action type ${propagateAction.type}`);
    }

    function wasPrevPropagateActionTypeRequest() {
        return prevPropagateAction.type === REQUEST;
    }
}

function verifyIsPropagateAction(propagateAction, interceptFunction) {
    verify(
        propagateAction,
        isPropagateAction,
        `The ${interceptFunction} generator/iterator should return/yield a propagate action at the end (or throw an error).`
    );
}

function verifyPropagateActionTypeAllowedAfterPrevType(prevPropagateAction, propagateAction) {
    verify(
        [propagateAction.type, prevPropagateAction.type],
        ([type, prevType]) => {
            if (type === REQUEST && prevType !== REQUEST) {
                return false;
            }
            return true;
        },
        `Propagate action type ${propagateAction.type} not allowed after previous type ${prevPropagateAction.type}`
    );
}