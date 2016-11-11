/* global fetch */

import {setupInterceptorChain} from './interceptor/interceptorChain';
import {
    runRequestInterceptorsAndCallFetch,
    runRemainingResponseInterceptors
} from './interceptor/run/runInterceptorChain';
import {propagateRequest, propagateResponse, propagateError} from './interceptor/propagateActions';
import {isResponseActionType} from './interceptor/propagateActionTypes';
import {getLogLevelInterceptorStart, getLogLevelInterceptorInputAndOutput} from './config/configSelectors';
import verify from '../util/verify';
import is from '../util/is';
import initLogger from '../util/log/logger';

const fetch = (requestBuilder) => {
    verify(requestBuilder, isRequestBuilderXL, 'Input should be a RequestBuilderXL.');

    const interceptorChain = setupInterceptorChain(requestBuilder.interceptors);
    const loggers = setupLoggers(requestBuilder);

    return new Promise((resolve, reject) => {
        runRequestInterceptorsAndCallFetch(propagateRequest(requestBuilder), interceptorChain, loggers)
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
            runRemainingResponseInterceptors(responseOrErrorPropagateAction, interceptorChain, loggers)
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

function isRequestBuilderXL(requestBuilderXL) {
    if (!is.builder(requestBuilderXL)) {
        return false;
    }

    if (!is.array(requestBuilderXL.interceptors)) {
        return false;
    }

    if (!is.set(requestBuilderXL.config)) {
        return false;
    }

    return true;
}

function setupLoggers(requestBuilderXL) {
    const fetchContext = `FetchXL ${requestBuilderXL.url}`;

    return {
        interceptorStartLogger: initLogger(fetchContext, getLogLevelInterceptorStart(requestBuilderXL.config)),
        interceptorInOutLogger: initLogger(fetchContext, getLogLevelInterceptorInputAndOutput(requestBuilderXL.config))
    };
}