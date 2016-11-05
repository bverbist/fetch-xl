/* global fetch */

import is from '../util/is';

const executeFetch = (request) => {
    if (is.builder(request)) {
        request = request.build();
    }

    return fetch(request);
};

export default {
    fetch: executeFetch
};