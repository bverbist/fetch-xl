import {RequestBuilderXL} from './RequestBuilderXL';
import {NO_DEFAULT_METHOD, NO_DEFAULT_URL} from './DefaultsBuilder';
import {newAction} from './ActionBuilder';
import {appendUrl} from '../util/url';

export class ResourceBuilder extends RequestBuilderXL {
    constructor(parentRequestBuilderXL = null) {
        super(NO_DEFAULT_METHOD, NO_DEFAULT_URL, parentRequestBuilderXL);
    }

    baseUrl(resourceBaseUrl) {
        this.url = appendUrl(resourceBaseUrl).toUrl(this.url);
        return this;
    }

    action() {
        return newAction(this);
    }
}