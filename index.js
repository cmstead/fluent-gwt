(function (gwtFactory) {
    module.exports = gwtFactory();
})(function () {

    function TestCase(description, givenFunction) {
        this.givenDescription = description;
        this.givenFunction = this.wrapInPromise(givenFunction);
    }

    TestCase.prototype = {
        wrapInPromise: function (handler) {
            return function (...args) {
                return new Promise(function (resolve) {
                    const result = handler(...args);

                    resolve(result);
                });
            }
        },

        when: function (description, whenFunction) {
            this.whenDescription = description;
            this.whenFunction = whenFunction;

            const thenHandler = (...args) => this.then(...args);

            return {
                then: thenHandler,
                assert: thenHandler
            };
        },

        then: function (description, thenFunction) {
            this.thenDescription = description;
            this.thenFunction = thenFunction;

            return this.executeCase();
        },

        buildFailureMessage: function (error) {
            return 'Test failed:\n\n' +
                'Given: ' + this.givenDescription + '\n' +
                'When: ' + this.whenDescription + '\n' +
                'Then: ' + this.thenDescription + '\n' +
                '\nError message: ' + error.message;
        },

        runAssertion: function (whenResult) {
            try {
                return this.thenFunction(whenResult);
            } catch (error) {
                const gwtMessage = this.buildFailureMessage(error);

                throw new Error(gwtMessage);
            }
        },

        executeCase: function () {
            return this.givenFunction()
                .then((givenResult) => this.whenFunction(givenResult))
                .then((whenResult) => this.runAssertion(whenResult));
        }
    };

    function given(description, givenFunction) {
        const testCase = new TestCase(description, givenFunction);
        const whenHandler = (...args) => testCase.when(...args);

        return {
            when: whenHandler,
            act: whenHandler
        }
    }

    return {
        given: given,
        arrange: given
    };

});