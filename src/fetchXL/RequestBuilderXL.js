import fetcherXL from './fetcherXL';
import {RequestBuilder} from '../fetch/RequestBuilder';
import {CONFIG_OPTION} from './config/configOptions';
import getDefaultConfig from './config/defaultConfig';
import {LOG_LEVEL} from '../util/log/logLevels';
import {METHOD} from '../util/http';
import is from '../util/is';
import {copyArray, cloneSimpleObject} from '../util/clone';

export class RequestBuilderXL extends RequestBuilder {
    static get(url, parentRequestBuilderXL = null) {
        return new RequestBuilderXL(METHOD.GET, url, parentRequestBuilderXL);
    }

    static post(url, parentRequestBuilderXL = null) {
        return new RequestBuilderXL(METHOD.POST, url, parentRequestBuilderXL);
    }

    static put(url, parentRequestBuilderXL = null) {
        return new RequestBuilderXL(METHOD.PUT, url, parentRequestBuilderXL);
    }

    static patch(url, parentRequestBuilderXL = null) {
        return new RequestBuilderXL(METHOD.PATCH, url, parentRequestBuilderXL);
    }

    static delete(url, parentRequestBuilderXL = null) {
        return new RequestBuilderXL(METHOD.DELETE, url, parentRequestBuilderXL);
    }

    constructor(method, url, parentRequestBuilderXL = null) {
        super(method, url, parentRequestBuilderXL);

        this.interceptors = is.set(parentRequestBuilderXL) ?
            copyArray(parentRequestBuilderXL.interceptors) : getDefaultInterceptors();
        this.config = is.set(parentRequestBuilderXL) ?
            cloneSimpleObject(parentRequestBuilderXL.config) : getDefaultConfig();
    }

    interceptor(interceptor) {
        if (is.builder(interceptor)) {
            interceptor = interceptor.build();
        }
        this.interceptors.push(interceptor);
        return this;
    }

    logInterceptorStart(logLevel = LOG_LEVEL.LOG) {
        this.config[CONFIG_OPTION.LOG_LEVEL_INTERCEPTOR_START] = logLevel;
        return this;
    }

    logInterceptorInAndOut(logLevel = LOG_LEVEL.LOG) {
        this.config[CONFIG_OPTION.LOG_LEVEL_INTERCEPTOR_IN_OUT] = logLevel;
        return this;
    }

    fetch() {
        return fetcherXL.fetch(this);
    }
}

function getDefaultInterceptors() {
    return [];
}