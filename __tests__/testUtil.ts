/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import {parseLogLevel, LOG_LEVEL, Logging, Logger, LogMethodCall} from "../src/index";

describe("Utility functions", () => {

	function mockLoggerWithTarget() {

		const logger = new Logger();
		const target = {
			log: jest.fn(),
			close: jest.fn(),
			setLevel: jest.fn(),
			getLevel: jest.fn()
		};

		logger.to("trg", target);

		return {
			logger: logger,
			target: target
		};

	}

	it("#parseLogLevel should parse proper value", () => {

		// Uppercase variants
		expect(parseLogLevel("DEBUG")).toEqual(LOG_LEVEL.DEBUG);
		expect(parseLogLevel("INFO")).toEqual(LOG_LEVEL.INFO);
		expect(parseLogLevel("NOTICE")).toEqual(LOG_LEVEL.NOTICE);
		expect(parseLogLevel("WARN")).toEqual(LOG_LEVEL.WARN);
		expect(parseLogLevel("WARNING")).toEqual(LOG_LEVEL.WARN);
		expect(parseLogLevel("ERROR")).toEqual(LOG_LEVEL.ERROR);
		expect(parseLogLevel("CRITICAL")).toEqual(LOG_LEVEL.CRITICAL);
		expect(parseLogLevel("CRIT")).toEqual(LOG_LEVEL.CRITICAL);
		expect(parseLogLevel("ALERT")).toEqual(LOG_LEVEL.ALERT);
		expect(parseLogLevel("EMERGENCY")).toEqual(LOG_LEVEL.EMERGENCY);
		expect(parseLogLevel("EMERG")).toEqual(LOG_LEVEL.EMERGENCY);
		expect(parseLogLevel("PANIC")).toEqual(LOG_LEVEL.EMERGENCY);

		// Lower case variants

		expect(parseLogLevel("debug")).toEqual(LOG_LEVEL.DEBUG);
		expect(parseLogLevel("info")).toEqual(LOG_LEVEL.INFO);
		expect(parseLogLevel("notice")).toEqual(LOG_LEVEL.NOTICE);
		expect(parseLogLevel("warn")).toEqual(LOG_LEVEL.WARN);
		expect(parseLogLevel("warning")).toEqual(LOG_LEVEL.WARN);
		expect(parseLogLevel("error")).toEqual(LOG_LEVEL.ERROR);
		expect(parseLogLevel("critical")).toEqual(LOG_LEVEL.CRITICAL);
		expect(parseLogLevel("crit")).toEqual(LOG_LEVEL.CRITICAL);
		expect(parseLogLevel("alert")).toEqual(LOG_LEVEL.ALERT);
		expect(parseLogLevel("emergency")).toEqual(LOG_LEVEL.EMERGENCY);
		expect(parseLogLevel("emerg")).toEqual(LOG_LEVEL.EMERGENCY);
		expect(parseLogLevel("panic")).toEqual(LOG_LEVEL.EMERGENCY);

	});

	it("Logging decorator should assign logger facility", () => {

		const mock = mockLoggerWithTarget();

		@Logging("facility", {
			logger: mock.logger,
			level: LOG_LEVEL.DEBUG
		})
		class MyClass {

			public log: Logger;

			public doSomething() {

				this.log.error("Hello");

			}

		}

		const myObj = new MyClass();
		myObj.doSomething();

		expect(mock.target.log).toHaveBeenCalled();

	});

	it("LogMethodCall decorator should log method call", () => {

		const mock = mockLoggerWithTarget();

		@Logging("facility", {
			logger: mock.logger,
			level: LOG_LEVEL.DEBUG
		})
		class MyClass {

			public log: Logger;

			@LogMethodCall(LOG_LEVEL.DEBUG, true, "Hey")
			public doSomething(...args) {

				return true;

			}

		}

		const myObj = new MyClass();

		expect(myObj.doSomething("hello", "world")).toEqual(true);
		expect(mock.target.log).toHaveBeenCalled();

	});

	it("Logging and LogMethodCall decorator should work with zero configuration", () => {

		const mock = mockLoggerWithTarget();

		@Logging(null, {
			logger: mock.logger
		})
		class MyClass {

			public log: Logger;

			@LogMethodCall()
			public doSomething(...args) {

				return true;

			}

		}

		const myObj = new MyClass();

		expect(myObj.doSomething("hello", "world")).toEqual(true);
		expect(mock.target.log).toHaveBeenCalled();

	});

});
