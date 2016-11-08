import fetcherXL from './fetcherXL';
import {RequestBuilder} from '../fetch/RequestBuilder';
import {METHOD} from '../util/http';
import is from '../util/is';

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

        this.interceptors = is.set(parentRequestBuilderXL) ? parentRequestBuilderXL.interceptors : [];
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