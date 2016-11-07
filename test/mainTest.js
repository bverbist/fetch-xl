/* global fetch */

import * as fetchJs from '../src/index';

const TEST_URL = {
    GET: 'https://jsonplaceholder.typicode.com/posts/1'
};

console.log(`fetchjs imported: ${JSON.stringify(fetchJs)}`);


console.log('[01] Use RequestBuilder with real fetch:');
const getRequest = fetchJs.RequestBuilder.get(TEST_URL.GET).build();
fetch(getRequest)
    .then((response) => response.json())
    .then((response) => {
        console.log('[01] GET fetch ok');
        console.log(JSON.stringify(response));
    });


console.log('[02] Use RequestBuilder to do a basic fetch:');
fetchJs.RequestBuilder.get(TEST_URL.GET)
    .fetch()
    .then((response) => response.json())
    .then((response) => {
        console.log('[02] GET fetch ok');
        console.log(JSON.stringify(response));
    });


console.log('[03] Use RequestBuilderXL to do an XL fetch with some interceptors:');
fetchJs.RequestBuilderXL.get(TEST_URL.GET)
    .interceptor(fetchJs.interceptors.rejectHttpErrorStatusResponseInterceptor)
    .interceptor(fetchJs.interceptors.jsonResponseInterceptor)
    .fetch()
    .then((response) => {
        console.log('[03] GET fetch ok');
        console.log(JSON.stringify(response));
    });