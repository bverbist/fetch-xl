import fetcherXL from './fetcherXL';
import {RequestBuilder} from '../fetch/RequestBuilder';
import {METHOD} from '../util/http';
import is from '../util/is';

export class RequestBuilderXL extends RequestBuilder {
    static get(url) {
        return new RequestBuilderXL(METHOD.GET, url);
    }

    static post(url) {
        return new RequestBuilderXL(METHOD.POST, url);
    }

    static put(url) {
        return new RequestBuilderXL(METHOD.PUT, url);
    }

    static patch(url) {
        return new RequestBuilderXL(METHOD.PATCH, url);
    }

    static delete(url) {
        return new RequestBuilderXL(METHOD.DELETE, url);
    }

    constructor(method, url) {
        super(method, url);

        this.interceptors = [];
    }

    interceptor(interceptor) {
        if (is.builder(interceptor)) {
            interceptor = interceptor.build();
        }
        this.interceptors.push(interceptor);
        return this;
    }

    fetch() {
        return fetcherXL.fetch(this, this.interceptors);
    }
}