import is from './is';

describe('is:', () => {
    describe('is.undefined()', () => {
        it('returns true if input undefined', () => {
            expect(is.undefined()).toEqual(true);
            expect(is.undefined(undefined)).toEqual(true);

            let varWithoutValue;
            expect(is.undefined(varWithoutValue)).toEqual(true);
        });

        it('returns false if input defined', () => {
            expect(is.undefined('')).toEqual(false);
            expect(is.undefined(0)).toEqual(false);
            expect(is.undefined([])).toEqual(false);
            expect(is.undefined({})).toEqual(false);
            expect(is.undefined(null)).toEqual(false);
            expect(is.undefined(() => {})).toEqual(false);
        });
    });

    describe('is.null()', () => {
        it('returns true if input null', () => {
            expect(is.null(null)).toEqual(true);

            const nullVar = null;
            expect(is.null(nullVar)).toEqual(true);
        });

        it('returns false if input not null', () => {
            expect(is.null('')).toEqual(false);
            expect(is.null(0)).toEqual(false);
            expect(is.null([])).toEqual(false);
            expect(is.null({})).toEqual(false);

            expect(is.null(undefined)).toEqual(false);
        });
    });

    describe('is.set()', () => {
        it('returns true if input defined and not null', () => {
            expect(is.set('')).toEqual(true);
            expect(is.set(0)).toEqual(true);
            expect(is.set([])).toEqual(true);
            expect(is.set({})).toEqual(true);

            const obj = {
                dummyVar: 'dummyVal'
            };
            expect(is.set(obj.dummyVar)).toEqual(true);
        });

        it('returns false if input undefined or null', () => {
            expect(is.set()).toEqual(false);
            expect(is.set(null)).toEqual(false);

            const obj = {};
            expect(is.set(obj.dummyVar)).toEqual(false);
        });
    });

    describe('is.promise()', () => {
        it('returns true if input is a promise', () => {
            const prom = Promise.resolve('success');
            expect(is.promise(prom)).toEqual(true);
        });

        it('returns false if input is not a promise', () => {
            const fakePromise = {
                then: () => {}
            };
            expect(is.promise(fakePromise)).toEqual(false);

            expect(is.promise()).toEqual(false);
        });
    });

    describe('is.iterator()', () => {
        it('returns true if input is a regular iterator', () => {
            const regularIterator = {
                next: () => {},
                throw: () => {}
            };

            expect(is.iterator(regularIterator)).toEqual(true);
        });

        it('returns true if input is an iterator from an es6 generator', () => {
            function* dummyGenerator() {
                yield 7;
                yield 11;
            }

            expect(is.iterator(dummyGenerator())).toEqual(true);
        });

        it('returns false if input is not an iterator', () => {
            const notAnIterator = {
                next: () => {}
            };
            expect(is.iterator(notAnIterator)).toEqual(false);

            expect(is.iterator()).toEqual(false);
        });
    });

    describe('is.action()', () => {
        it('returns true if input object has a type (string) and a payload', () => {
            const dummyAction = {
                type: 'TYPE',
                payload: {}
            };
            expect(is.action(dummyAction)).toEqual(true);
        });

        it('returns false if input does not have a type or payload', () => {
            expect(is.action()).toEqual(false);
            expect(is.action({})).toEqual(false);
            expect(is.action({type: 'TYPE'})).toEqual(false);
            expect(is.action({payload: {}})).toEqual(false);
        });
    });

    describe('is.builder()', () => {
        it('returns true if input has a build function', () => {
            const dummyBuilder = {
                build: () => {}
            };
            expect(is.builder(dummyBuilder)).toEqual(true);

            class DummyBuilderClass {
                constructor() {
                    this.dummyVar = 'dummy val';
                }
                build() {
                    return this.dummyVar;
                }
            }
            expect(is.builder(new DummyBuilderClass())).toEqual(true);
        });

        it('returns false if input does not have a build function', () => {
            expect(is.builder()).toEqual(false);
            expect(is.builder({})).toEqual(false);
            expect(is.builder({build: 'not a function'})).toEqual(false);
        });
    });

    describe('is.logger()', () => {
        it('returns true if input at least has a log function', () => {
            const dummyLogger = {
                log: () => {}
            };
            expect(is.logger(dummyLogger)).toEqual(true);

            expect(is.logger(console)).toEqual(true);
        });

        it('returns false if input does not have a log function', () => {
            expect(is.logger()).toEqual(false);
            expect(is.logger({})).toEqual(false);
            expect(is.logger({log: 'not a function'})).toEqual(false);
        });
    });
});