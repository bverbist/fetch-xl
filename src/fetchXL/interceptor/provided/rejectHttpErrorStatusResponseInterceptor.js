/**
 * This interceptor is for overriding the default fetch behaviour where HTTP error statusses do not result in a rejected promise.
 *
 * See https://github.com/github/fetch
 *   The Promise returned from fetch() won't reject on HTTP error status even if the response is a HTTP 404 or 500.
 *   Instead, it will resolve normally, and it will only reject on network failure, or if anything prevented the request from completing.
 */

import InterceptorBuilder from '../InterceptorBuilder';
import {LAST} from '../interceptorPriorities';
import {propagateResponse} from '../propagateActions';
import {isStatusInSuccessRange} from '../../../util/http';

const rejectHttpErrorStatusResponseInterceptor = InterceptorBuilder.interceptor('rejectHttpErrorStatus')
    .priority(LAST)
    .interceptResponse(rejectHttpErrorStatus)
    .build();

export default rejectHttpErrorStatusResponseInterceptor;

function* rejectHttpErrorStatus(response) {
    console.log(`rejectHttpErrorStatus [${JSON.stringify(response)}]`);
    if (isStatusInSuccessRange(response.status)) {
        console.log(`rejectHttpErrorStatus [${response.status}]`);
        yield propagateResponse(response);
        console.log(`rejectHttpErrorStatus before return [${response.status}]`);
        return;
    }

    const error = new Error(response.statusText);
    error.status = response.status;
    error.response = response;
    throw error;
}