# Fluent-GWT #

Fluent-GWT is the answer to limiting the amount of build tooling needed in order to get well-structured tests created with a Given/When/Then or Arrange/Act/Assert style format.

Though Jasmine-Given, Mocha-Given, and Mocha-GWT exist, they all require, at the very least, a coffeescript compiler added into the toolchain.  This makes them hard to integrate into current testing solutions and unfriendly if users are already feeling tooling fatigue.

## Setup ##

Install with npm:

```npm install fluent-gwt --save-dev```

## Usage ##

Fluent-GWT can be used by requiring it into your test file (node) or adding it to your test runner and interfacing directly from the browser (client).

Requiring in node looks like this:

```javascript
const gwt = require('fluent-gwt');
```

Below is an example of a test using Fluent-GWT (used in Mocha):

```javascript
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
```

Fluent-GWT supports Arrange/Act/Assert (otherwise known as A/A/A or triple-A) style test setup:

```javascript
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
```

Fluent-GWT also supports callback-resolving functions this way:

```javascript
it('supports callback-style behaviors when a user needs to', function () {
    return gwt
        .given(
            'a promise-returning function is used',
            // gwt.fromCallback converts the callback-resolving function
            // into something Fluent-GWT can use
            gwt.fromCallback(callback => callback(null, 'callback string'))
        )
        .when(
            'an asynchronous when is used',
            (givenResult) => Promise.resolve(givenResult)
        )
        .then(
            'the async string should pass through',
            (actualResult) => assert.equal(actualResult, 'callback string')
        )
});
```

Fluent-GWT is promise-returning, so you can always "then" or "catch" against it:

```javascript
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
```