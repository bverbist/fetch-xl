import {RequestBuilderXL} from './RequestBuilderXL';

export const newAction = (parentRequestBuilderXL) => ({
    get: (url) => RequestBuilderXL.get(url, parentRequestBuilderXL),
    post: (url) => RequestBuilderXL.post(url, parentRequestBuilderXL),
    put: (url) => RequestBuilderXL.put(url, parentRequestBuilderXL),
    patch: (url) => RequestBuilderXL.patch(url, parentRequestBuilderXL),
    delete: (url) => RequestBuilderXL.delete(url, parentRequestBuilderXL)
});