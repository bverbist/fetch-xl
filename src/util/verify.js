const verify = (value, validator, errorMessage) => {
    if (!validator(value)) {
        throw new Error(errorMessage);
    }
};

export default verify;