export const METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
};

export const STATUS = {
    OK: 200,
    MULTIPLE_CHOICES: 300
};

export const HEADER = {
    AUTHORIZATION: 'Authorization',
    CACHE_CONTROL: 'Cache-Control',
    CONTENT_TYPE: 'Content-Type'
};

export const CONTENT_TYPE = {
    APPLICATION_JSON: 'application/json',
    TEXT_HTML: 'text/html',
    MULTIPART_FORMDATA: 'multipart/form-data'
};

export const isStatusInSuccessRange = (status) =>
    status >= STATUS.OK && status < STATUS.MULTIPLE_CHOICES;