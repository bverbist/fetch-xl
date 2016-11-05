import {isEffectAction} from '../effect/effectActionTypes';
import {handleEffect} from '../effect/effectActionHandler';
import is from '../../util/is';
import verify from '../../util/verify';

export const runIteratorAndReturnItsLastValue = (iterator) => {
    verify(
        iterator,
        is.iterator,
        'Input is not an iterator'
    );

    let lastDefinedValue;

    return recursiveNext();

    function recursiveNext() {
        const {value, done} = iterator.next();

        if (is.set(value)) {
            lastDefinedValue = value;
        }

        if (done) {
            return lastDefinedValue;
        }

        return recursiveNext();
    }
};

export const runIteratorAndReturnPromiseThatResolvesWithTheIteratorsLastValue = (iterator) => {
    verify(
        iterator,
        is.iterator,
        'Input is not an iterator'
    );

    return new Promise((resolve) => {
        let lastDefinedValue;

        recursiveNextAsync(iterator.next());

        function recursiveNextAsync(iteratorResult) {
            let {value} = iteratorResult;
            const {done} = iteratorResult;

            if (is.set(value)) {
                if (isEffectAction(value)) {
                    value = handleEffect(value);
                }

                lastDefinedValue = value;
            }

            if (done) {
                console.log(`iterator done: [${JSON.stringify(lastDefinedValue)}]`);
                resolve(lastDefinedValue);
            } else if (is.promise(value)) {
                value
                    .then(
                        // pass promise result to signal to iterator that promise was fulfilled
                        (res) => recursiveNextAsync(iterator.next(res)),
                        (err) => recursiveNextAsync(iterator.throw(err))
                    );
            } else {
                recursiveNextAsync(iterator.next());
            }
        }
    });
};