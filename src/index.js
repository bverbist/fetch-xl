import * as interceptorPriorities from './fetchXL/interceptor/interceptorPriorities';
import apiConfigurator from './fetchXL/apiConfigurator';

// to be able to do basic fetch calls
export {RequestBuilder} from './fetch/RequestBuilder';

// to be able to do extended fetch call by using provided interceptors
export {RequestBuilderXL} from './fetchXL/RequestBuilderXL';
export {providedInterceptors as interceptors} from './fetchXL/interceptor/provided/all';

// to be able to make your own interceptor
export {InterceptorBuilder} from './fetchXL/interceptor/InterceptorBuilder';
export {propagateRequest, propagateResponse, propagateError} from './fetchXL/interceptor/propagateActions';
export {interceptorPriorities};
export {awaitCall} from './fetchXL/effect/effectActions';

// to be able to make your own effectActions
export {effectAction, addHandler} from './fetchXL/effect/effectActionHandler';

export default apiConfigurator;