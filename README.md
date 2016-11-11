# fetch-xl
Fluent, interceptable and configurable fetch wrapper

## Installation
```
npm install fetch-xl
```

## Key Concepts

### RequestBuilder
* __goal:__ fluent api to build a fetch Request (e.g. url, headers, body, etc.)

### RequestBuilderXL
* __goal:__ Enhanced fluent api RequestBuilder that also allows the configuration of request/response/error interceptors and some debug logging.

### Interceptor
* __goal:__
  * to intercept the request before it's executed/fetched, or to intercept the response or error that's returned by the fetch action
  * multiple interceptors form an __interceptorChain__ and pass the 'intercepted' request/response/error to the next interceptor
* __config:__
  * priority {number} : determines the order of the executed interceptors
  * __intercept generator functions__ (see also below):
    * interceptRequest {generator} : to intercept the RequestBuilder before the actual Request is fetched
    * interceptResponse {generator} : to intercept a success response 
    * interceptErrorResponse {generator} : to intercept an error response
* __intercept generator functions:__
  * use the power of generators (es6) and have a similar concept as redux-sagas:
    * fetch-xl takes care of some logic (like async/promise) behind the scenes
    * just yield the different steps the intercept method has to do
    * end the intercept by yielding (or returning) one of the possible __propagateActions__ at the end
      * this yielded propagateAction determines the input of the next step in the __interceptorChain__
      * e.g. 'interceptRequest' can propagate the request (success flow) or can prohibit the execution of the actual fetch call by propagating a response or an error
    * you can use __effectActions__ prior to yielding/returning a propagateAction
* __propagateActions:__
  * propagateRequest : to pass a (un)modified RequestBuilder down the interceptorChain
  * propagateResponse : to pass a success response back up the interceptorChain
  * propagateError : to pass an error response back up the interceptorChain
* __effectActions:__
  * __awaitCall:__ if you need to call an asynchronous function (that returns a promise) during the intercept function. Yielding awaitCall will stop the intercept function until its promise is resolved. Surround it with a try-catch block if you want to handle the promise rejection.
  * you can add your own effectAction
* __provided interceptors:__
  * interceptRequest-interceptors:
    * __jsonRequestInterceptor:__ to automatically stringify the 'body' to JSON
  * interceptResponse-interceptors:
    * __jsonResponseInterceptor:__ to return the response as a JSON object
    * __rejectHttpErrorStatusResponseInterceptor:__ to override the default fetch behaviour where HTTP error statusses do not result in a rejected promise
    * __textResponseInterceptor:__ to return the response as text
  * ... list is still growing ... but you can easily add your own!

### InterceptorBuilder
* __goal:__ fluent api to build an interceptor

### apiConfigurator
* __goal:__
  * fluent api to configure your fetch api/resources
  * api configurations can be done on __multiple configuration levels__ - defaults, resource, action - where each level is in itself a RequestBuilder
    * the configurations are passed on to the lower level(s) so that e.g. the interceptors and baseUrl configured on the 'defaults' level will automatically be active on each 'lower' resource and action levels
  * multiple api's (with different baseUrl's) can be configured if needed, just call another apiConfigurator
* __multiple configuration levels:__
  * __defaults:__ for the default configuration of the api, e.g. the baseUrl and interceptors and/or headers that have to be applied for all resources/actions
  * __resource:__ for the configuration of a particular resource (a group of resource actions all sharing the same base url)
  * __action:__ for the configuration of a specific action
  * Example - a typical use case could be:
    * _defaults_ - http://some.site.com/rest/api
      * _resource A_ - /users
        * _action A1_ - GET  = to get all the users
        * _action A2_ - GET /:userId  = to get a single user
      * _resource B_ - /orders
        * _action B1_ - POST  = to place an order (create)
        * _action B2_ - PUT /:orderId  = to update an order

## Usage
fetch-xl is still a 'Work In Progress' ... examples will follow

## License
The MIT License
