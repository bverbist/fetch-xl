const ascendingPriorityComparator = (interceptorA, interceptorB) =>
    interceptorA.priority - interceptorB.priority;

export const sortInterceptorsByAscendingPriority = (interceptors) =>
    interceptors.sort(ascendingPriorityComparator);