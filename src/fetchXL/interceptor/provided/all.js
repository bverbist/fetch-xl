import jsonRequestInterceptor from './jsonRequestInterceptor';
import jsonResponseInterceptor from './jsonResponseInterceptor';
import rejectHttpErrorStatusResponseInterceptor from './rejectHttpErrorStatusResponseInterceptor';
import textResponseInterceptor from './textResponseInterceptor';

export const providedInterceptors = {
    jsonRequestInterceptor,
    jsonResponseInterceptor,
    rejectHttpErrorStatusResponseInterceptor,
    textResponseInterceptor
};

export default providedInterceptors;