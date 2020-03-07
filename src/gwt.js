function gwtFactory(logger) {
    function TestCase({ verbose = false }) {
        this.verbose = verbose;
    }

    TestCase.prototype = {
        logMessage: function (error, description) {
            if (this.verbose || Boolean(error)) {
                const status = !error ? 'OK' : 'Failed';
                logger.log('\tGWT: ' + status + ' - ' + description);
            }
        },

        promisfyResultCall: function (handler, ...args) {
            return new Promise(function (resolve, reject) {
                try {
                    resolve(handler(...args));
                } catch (error) {
                    reject(error);
                }
            });
        },

        wrapInPromise: function (description, handler) {
            return (...args) => new Promise((resolve, reject) => {
                let result = this.promisfyResultCall(handler, ...args);

                result
                    .then(() => {
                        this.logMessage(null, description);
                        resolve(result);
                    })
                    .catch((error) => {
                        this.logMessage(error, description);
                        reject(error);
                    });
            })
        },

        given: function (description, givenFunction = () => null) {
            this.givenFunction = this.wrapInPromise(
                'Given/Arrange: ' + description,
                givenFunction
            );

            return {
                when: (...args) => this.when(...args),
                act: (...args) => this.when(...args)
            };
        },

        when: function (description, whenFunction = () => null) {
            this.whenDescription = description;
            this.whenFunction = this.wrapInPromise(
                'When/Act: ' + description,
                whenFunction
            );

            const thenHandler = (...args) => this.then(...args);

            return {
                then: thenHandler,
                assert: thenHandler
            };
        },

        then: function (description, thenFunction = () => null) {
            this.thenDescription = description;
            this.thenFunction = this.wrapInPromise(
                'Then/Assert: ' + description,
                thenFunction
            );

            return this.executeCase();
        },

        runAssertion: function (whenResult) {
            return this.thenFunction(whenResult);
        },

        executeCase: function () {
            return this.givenFunction()
                .then((givenResult) => this.whenFunction(givenResult))
                .then((whenResult) => this.runAssertion(whenResult));
        }
    };

    function fromCallback(callbackStyleFunction) {
        return function (...args) {
            return new Promise(function (resolve, reject) {
                callbackStyleFunction(...args, function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
            });
        }
    }

    function configure(options = {}) {
        function givenArrange(description, givenHandler) {
            const testCase = new TestCase(options);

            return testCase.given(description, givenHandler)
        }

        return {
            given: givenArrange,
            arrange: givenArrange,
            fromCallback: fromCallback
        };
    }

    return {
        configure
    };
}

module.exports = gwtFactory;