import {RequestBuilderXL} from './RequestBuilderXL';

export const NO_DEFAULT_METHOD = undefined;
export const NO_DEFAULT_URL = undefined;

export class DefaultsBuilder extends RequestBuilderXL {
    constructor() {
        super(NO_DEFAULT_METHOD, NO_DEFAULT_URL);
    }

    baseUrl(baseUrl) {
        this.url = baseUrl;
        return this;
    }
}