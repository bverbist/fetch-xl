import {DEFAULT} from './interceptorPriorities';
import {verifyName, verifyPriority, verifyInterceptFunction} from './interceptorVerifier';

export class InterceptorBuilder {
    static interceptor(name) {
        return new InterceptorBuilder(name);
    }

    constructor(name) {
        verifyName(name);
        this.interceptor = {
            name,
            priority: DEFAULT
        };
    }

    priority(priority) {
        verifyPriority(priority);
        this.interceptor.priority = priority;
        return this;
    }

    interceptRequest(interceptRequest) {
        verifyInterceptFunction(interceptRequest);
        this.interceptor.interceptRequest = interceptRequest;
        return this;
    }

    interceptResponse(interceptResponse) {
        verifyInterceptFunction(interceptResponse);
        this.interceptor.interceptResponse = interceptResponse;
        return this;
    }

    interceptErrorResponse(interceptErrorResponse) {
        verifyInterceptFunction(interceptErrorResponse);
        this.interceptor.interceptErrorResponse = interceptErrorResponse;
        return this;
    }

    build() {
        return this.interceptor;
    }
}

export default InterceptorBuilder;