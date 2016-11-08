/* global fetch */

import apiConfigurator, {RequestBuilder, RequestBuilderXL, interceptors} from '../src/index';

const BASE_TEST_URL = 'https://jsonplaceholder.typicode.com';
const TEST_URL = {
    GET: `${BASE_TEST_URL}/posts/1`
};


console.log('[01] Use RequestBuilder with real fetch:');
const getRequest = RequestBuilder.get(TEST_URL.GET).build();
fetch(getRequest)
    .then((response) => response.json())
    .then((response) => {
        console.log('[01] GET fetch ok');
        console.log(JSON.stringify(response));
    });


console.log('[02] Use RequestBuilder fluently to do a basic fetch:');
RequestBuilder.get(TEST_URL.GET)
    .fetch()
    .then((response) => response.json())
    .then((response) => {
        console.log('[02] GET fetch ok');
        console.log(JSON.stringify(response));
    });


console.log('[03] Use RequestBuilderXL to do an XL fetch with some interceptors:');
RequestBuilderXL.get(TEST_URL.GET)
    .interceptor(interceptors.rejectHttpErrorStatusResponseInterceptor)
    .interceptor(interceptors.jsonResponseInterceptor)
    .fetch()
    .then((response) => {
        console.log('[03] GET fetch ok');
        console.log(JSON.stringify(response));
    });


console.log('[04] Use default export function (= apiConfigurator) to configure your (resource) api fluently:');
const testApi = apiConfigurator();
testApi.defaults()
    .baseUrl(BASE_TEST_URL)
    .interceptor(interceptors.rejectHttpErrorStatusResponseInterceptor);
const postsResource = testApi.resource()
    .baseUrl('/posts')
    .interceptor(interceptors.jsonResponseInterceptor);
postsResource.action()
    .get('/:id')
    .pathParam('id', '1')
    .fetch()
    .then(
        (response) => {
            console.log('[04] GET fetch ok');
            console.log(JSON.stringify(response));
        },
        (error) => {
            console.log('[04] GET fetch NOK');
            console.log(JSON.stringify(error));
        });