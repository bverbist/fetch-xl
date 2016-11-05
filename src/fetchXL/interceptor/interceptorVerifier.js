import {FIRST, LAST} from './interceptorPriorities';
import is from '../../util/is';
import verify from '../../util/verify';

export const verifyName = (name) =>
    verify(name, is.set, 'Please provide a name when constructing/newing a fetch interceptor.');

export const verifyInterceptFunction = (interceptFunction) =>
    verify(interceptFunction, is.function, 'Intercept input should be a function (ideally an es6 generator).');

export const verifyPriority = (priority) => {
    verify(
        priority,
        (prio) => is.number(prio) && isPriorityBetweenMinAndMax(prio),
        `Priority should be a number between ${FIRST} and ${LAST}.`
    );
};

function isPriorityBetweenMinAndMax(priority) {
    return priority >= FIRST && priority <= LAST;
}