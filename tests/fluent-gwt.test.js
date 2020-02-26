const { assert } = require('chai');
const sinon = require('sinon');

const gwtFactory = require('../src/gwt');

describe('Fluent GWT', function () {

    let gwt;
    let loggerFake;

    beforeEach(function () {
        loggerFake = {
            log: sinon.stub()
        };

        gwt = gwtFactory(loggerFake).configure({});
    });

    it('tests a behavior when a user defines a simple, synchronous test', function () {
        return gwt
            .given(
                'User event is described and has an initial state',
                () => 'test string'
            )
            .when(
                'Behavior is called, capture outcome',
                (valueToUse) => valueToUse + ': success'
            )
            .then(
                'Outcome should match expectation',
                (outcomeToTest) => assert.equal(outcomeToTest, 'test string: success')
            );
    });

    it('bubbles up error when a test fails', function () {
        return gwt
            .given(
                'User event is described and has an initial state',
                () => 'test string'
            )
            .when(
                'Behavior is called, capture outcome',
                (valueToUse) => valueToUse + ': success'
            )
            .then(
                'Outcome should match expectation',
                () => {
                    throw new Error('This test failed because reasons');
                })

            .then(function () {
                assert.isFalse(true);
            })
            .catch(function (error) {
                assert.equal(error.message, 'This test failed because reasons');
            });
    });

    it('resolves "given" properly when user supplies a promise-returning function', function () {
        return gwt
            .given(
                'a promise-returning function is used',
                () => Promise.resolve('async string')
            )
            .when(
                'a synchronous when is used',
                (givenResult) => givenResult
            )
            .then(
                'the async string should pass through',
                (actualResult) => assert.equal(actualResult, 'async string')
            )
    });

    it('resolves "when" properly when user supplies a promise-returning function', function () {
        return gwt
            .given(
                'a promise-returning function is used',
                () => Promise.resolve('async string')
            )
            .when(
                'an asynchronous when is used',
                (givenResult) => Promise.resolve(givenResult)
            )
            .then(
                'the async string should pass through',
                (actualResult) => assert.equal(actualResult, 'async string')
            )
    });

    it('works as expected when arrange/act/assert is preferred by the user', function () {
        return gwt
            .arrange(
                'a promise-returning function is used',
                () => Promise.resolve('async string')
            )
            .act(
                'an asynchronous when is used',
                (givenResult) => Promise.resolve(givenResult)
            )
            .assert(
                'the async string should pass through',
                (actualResult) => assert.equal(actualResult, 'async string')
            )
    });

    it('supports callback-style behaviors when a user needs to', function () {
        return gwt
            .arrange(
                'a promise-returning function is used',
                gwt.fromCallback(callback => callback(null, 'callback string'))
            )
            .act(
                'an asynchronous when is used',
                (givenResult) => Promise.resolve(givenResult)
            )
            .assert(
                'the async string should pass through',
                (actualResult) => assert.equal(actualResult, 'callback string')
            )
    });

    it('Displays failing GWT step when a test fails, regardless of mode', function () {
        const errorMessage = 'Oh no!';

        return gwt
            .given(
                'GWT is configured in verbose mode',
                () => gwtFactory(loggerFake)
                    .configure({
                        verbose: false
                    })
            )
            .when(
                'a passing test is executed',
                (gwtUnderTest) => gwtUnderTest
                    .given('test given', () => { throw new Error(errorMessage) })
                    .when('test when', () => null)
                    .then('test then', () => null)

                    .catch(() => Promise.resolve(true))
            )
            .then(
                'logger should be called with GWT information and okay state',
                () => {
                    assert.equal(loggerFake.log.args[0][0], 'GWT: Failed - Given/Arrange: test given');
                }
            )

            .catch((error) => {
                if (error.message.includes(errorMessage)) {
                    return Promise.resolve(true);
                } else {
                    return Promise.reject(error);
                }
            });
    });


    describe('verbose mode', function () {
        it('calls logger with all GWT messaging in verbose mode for a passing test', function () {
            return gwt
                .given(
                    'GWT is configured in verbose mode',
                    () => gwtFactory(loggerFake)
                        .configure({
                            verbose: true
                        })
                )
                .when(
                    'a passing test is executed',
                    (gwtUnderTest) => gwtUnderTest
                        .given('test given', () => null)
                        .when('test when', () => null)
                        .then('test then', () => null)
                )
                .then(
                    'logger should be called with GWT information and okay state',
                    () => {
                        assert.equal(loggerFake.log.args[0][0], 'GWT: OK - Given/Arrange: test given');
                        assert.equal(loggerFake.log.args[1][0], 'GWT: OK - When/Act: test when');
                        assert.equal(loggerFake.log.args[2][0], 'GWT: OK - Then/Assert: test then');
                    }
                );
        });

        it('calls logger with failed status message for given when an error is thrown', function () {
            const errorMessage = 'Oh no!';

            return gwt
                .given(
                    'GWT is configured in verbose mode',
                    () => gwtFactory(loggerFake)
                        .configure({
                            verbose: true
                        })
                )
                .when(
                    'a passing test is executed',
                    (gwtUnderTest) => gwtUnderTest
                        .given('test given', () => { throw new Error(errorMessage) })
                        .when('test when', () => null)
                        .then('test then', () => null)

                        .catch(() => Promise.resolve(true))
                )
                .then(
                    'logger should be called with GWT information and okay state',
                    () => {
                        assert.equal(loggerFake.log.args[0][0], 'GWT: Failed - Given/Arrange: test given');
                    }
                )

                .catch((error) => {
                    if (error.message.includes(errorMessage)) {
                        return Promise.resolve(true);
                    } else {
                        return Promise.reject(error);
                    }
                });
        });

        it('calls logger with failed status message for "when" when an error is thrown', function () {
            const errorMessage = 'Oh no!';

            return gwt
                .given(
                    'GWT is configured in verbose mode',
                    () => gwtFactory(loggerFake)
                        .configure({
                            verbose: true
                        })
                )
                .when(
                    'a passing test is executed',
                    (gwtUnderTest) => gwtUnderTest
                        .given('test given', () => null)
                        .when('test when', () => { throw new Error(errorMessage) })
                        .then('test then', () => null)

                        .catch(() => Promise.resolve(true))
                )
                .then(
                    'logger should be called with GWT information and okay state',
                    () => {
                        assert.equal(loggerFake.log.args[1][0], 'GWT: Failed - When/Act: test when');
                    }
                )

                .catch((error) => {
                    if (error.message.includes(errorMessage)) {
                        return Promise.resolve(true);
                    } else {
                        return Promise.reject(error);
                    }
                });
        });

        it('calls logger with failed status message for "then" when an error is thrown', function () {
            const errorMessage = 'Oh no!';

            return gwt
                .given(
                    'GWT is configured in verbose mode',
                    () => gwtFactory(loggerFake)
                        .configure({
                            verbose: true
                        })
                )
                .when(
                    'a passing test is executed',
                    (gwtUnderTest) => gwtUnderTest
                        .given('test given', () => null)
                        .when('test when', () => null)
                        .then('test then', () => { throw new Error(errorMessage) })

                        .catch(() => Promise.resolve(true))
                )
                .then(
                    'logger should be called with GWT information and okay state',
                    () => {
                        assert.equal(loggerFake.log.args[2][0], 'GWT: Failed - Then/Assert: test then');
                    }
                )

                .catch((error) => {
                    if (error.message.includes(errorMessage)) {
                        return Promise.resolve(true);
                    } else {
                        return Promise.reject(error);
                    }
                });
        });

        it('calls logger with failed status message for "then" when an error is thrown', function () {
            const errorMessage = 'Oh no!';

            return gwt
                .given(
                    'GWT is configured in verbose mode',
                    () => gwtFactory(loggerFake)
                        .configure({
                            verbose: true
                        })
                )
                .when(
                    'a passing test is executed',
                    (gwtUnderTest) => gwtUnderTest
                        .given('test given', () => null)
                        .when('test when', () => null)
                        .then('test then', () => { throw new Error(errorMessage) })

                        .catch(() => Promise.resolve(true))
                )
                .then(
                    'logger should be called with GWT information and okay state',
                    () => {
                        assert.equal(loggerFake.log.args[2][0], 'GWT: Failed - Then/Assert: test then');
                    }
                )

                .catch((error) => {
                    if (error.message.includes(errorMessage)) {
                        return Promise.resolve(true);
                    } else {
                        return Promise.reject(error);
                    }
                });
        });
    });
});