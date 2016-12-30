BOOTSTRAP = test/bootstrap.test.js
TESTS = test/unit/**/*.test.js
TESTS_API = test/unit/api/*/*.test.js
TESTS_MODELS = test/unit/models/*.test.js
TESTS_SERVICES = test/unit/services/*.test.js
TESTS_CONTROLLERS = test/unit/controllers/*.test.js

test:
	@mocha $(BOOTSTRAP) $(TESTS)

test-api:
	@mocha $(BOOTSTRAP) $(TESTS_API)

test-models:
	@mocha $(BOOTSTRAP) $(TESTS_MODELS)

test-services:
	@mocha $(BOOTSTRAP) $(TESTS_SERVICES)

test-controllers:
	@mocha $(BOOTSTRAP) $(TESTS_CONTROLLERS)

test-cover:
	@istanbul cover _mocha -- $(BOOTSTRAP) $(TESTS)

docs:
	@apidoc -i api/ -o doc

.PHONY: test