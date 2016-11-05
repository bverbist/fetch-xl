export const containsUrlParam = (url) =>
    url.indexOf('?') > -1;

export const appendUrlParam = (paramName) => ({
    withValue: (paramValue) => ({
        toUrl: (url) => {
            const separator = containsUrlParam(url) ? '&' : '?';
            return `${url}${separator}${paramName}=${paramValue}`;
        }
    })
});

export const replacePathParam = (paramName) => ({
    withValue: (paramValue) => ({
        inUrl: (url) =>
            url.replace(`:${paramName}`, paramValue)
    })
});