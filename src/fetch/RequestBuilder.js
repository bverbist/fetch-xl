/* global Request Headers */

import fetcher from './fetcher';
import {METHOD, HEADER} from '../util/http';
import {appendUrl, appendUrlParam, replacePathParam} from '../util/url';
import is from '../util/is';
import {cloneSimpleObject} from '../util/clone';

export class RequestBuilder {
    static get(url, parentRequestBuilder = null) {
        return new RequestBuilder(METHOD.GET, url, parentRequestBuilder);
    }

    static post(url, parentRequestBuilder = null) {
        return new RequestBuilder(METHOD.POST, url, parentRequestBuilder);
    }

    static put(url, parentRequestBuilder = null) {
        return new RequestBuilder(METHOD.PUT, url, parentRequestBuilder);
    }

    static patch(url, parentRequestBuilder = null) {
        return new RequestBuilder(METHOD.PATCH, url, parentRequestBuilder);
    }

    static delete(url, parentRequestBuilder = null) {
        return new RequestBuilder(METHOD.DELETE, url, parentRequestBuilder);
    }

    constructor(method, url, parentRequestBuilder = null) {
        if (is.set(parentRequestBuilder)) {
            this.url = parentRequestBuilder.url;
            this.initOptions = cloneSimpleObject(parentRequestBuilder.initOptions);

            if (is.set(method)) {
                this.initOptions.method = method;
            }

            this.url = appendUrl(url).toUrl(this.url);
        } else {
            this.url = url;
            this.initOptions = {
                method
            };
        }
    }

    pathParam(name, value) {
        this.url = replacePathParam(name).withValue(value).inUrl(this.url);
        return this;
    }

    urlParam(name, value) {
        this.url = appendUrlParam(name).withValue(value).toUrl(this.url);
        return this;
    }

    body(body) {
        this.initOptions.body = body;
        return this;
    }

    bodyAsJson(body) {
        return this.body(JSON.stringify(body));
    }

    header(name, value) {
        if (!this.initOptions.headers) {
            this.initOptions.headers = new Headers();
        }

        this.initOptions.headers.append(name, value);
        return this;
    }

    headerAuthorization(value) {
        return this.header(HEADER.AUTHORIZATION, value);
    }

    headerContentType(value) {
        return this.header(HEADER.CONTENT_TYPE, value);
    }

    mode(mode) {
        this.initOptions.mode = mode;
        return this;
    }

    credentials(credentials) {
        this.initOptions.credentials = credentials;
        return this;
    }

    cache(cacheMode) {
        this.initOptions.cache = cacheMode;
        return this;
    }

    redirect(redirectMode) {
        this.initOptions.redirect = redirectMode;
        return this;
    }

    referrer(referrer) {
        this.initOptions.referrer = referrer;
        return this;
    }

    integrity(integrity) {
        this.initOptions.integrity = integrity;
        return this;
    }

    build() {
        return new Request(this.url, this.initOptions);
    }

    fetch() {
        return fetcher.fetch(this.build());
    }
}