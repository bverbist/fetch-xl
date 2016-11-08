/**
 * Works for objects that only have basic vars.
 * Does not properly work if there are functions or Date vars in the source object.
 */
export const cloneSimpleObject = (objToClone) => JSON.parse(JSON.stringify(objToClone));

export const copyArray = (arr) => arr.slice(0);