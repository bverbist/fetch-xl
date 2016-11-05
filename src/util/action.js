import is from './is';

const action = (type, payload, ...extraKeyValueArrays) => {
    const actionObj = {
        type,
        payload
    };

    if (is.set(extraKeyValueArrays)) {
        extraKeyValueArrays.forEach(([key, val]) => {
            actionObj[key] = val;
        });
    }

    return actionObj;
};

export const isAction = (act) =>
    act && act.type && act.payload;

export default action;