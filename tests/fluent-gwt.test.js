const { assert } = require('chai');

const gwt = require('../index');

describe('Fluent GWT', function () {

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

    it('provides GWT output when a test fails', function () {
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
                const failureMessage = 'Test failed:\n\n' +
                    'Given: User event is described and has an initial state\n' +
                    'When: Behavior is called, capture outcome\n' +
                    'Then: Outcome should match expectation\n' +
                    '\n' +
                    'Error message: This test failed because reasons'

                assert.equal(error.message, failureMessage);
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
});