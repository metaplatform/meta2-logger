/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import {
	Logger, ILoggerTarget, LOG_LEVEL, LoggerFacility,
	ConsoleTarget, FileTarget, JsonFileTarget, GraylogTarget
} from "../src/index";

describe("LoggerFacility class", () => {

	function mockTarget() {

		const target: ILoggerTarget = {
			log: jest.fn(),
			close: jest.fn(),
			setLevel: jest.fn(),
			getLevel: jest.fn()
		};

		return target;

	}

	function mockLoggerFacilityWithTarget(facilityName: string) {

		const logger = new Logger();
		const target = mockTarget();
		const facility = new LoggerFacility(logger, facilityName);

		logger.to("trg", target);

		return {
			logger: logger,
			target: target,
			facility: facility
		};

	}

	it("should construct", () => {

		const logger = new Logger();
		const facility = new LoggerFacility(logger, "fac");

		expect(facility).toBeInstanceOf(LoggerFacility);

	});

	it("should construct with configuration", () => {

		const logger = new Logger();
		const facility = new LoggerFacility(logger, "fac", {
			level: LOG_LEVEL.WARN
		});

		expect(facility).toBeInstanceOf(LoggerFacility);
		expect(facility.getLevel()).toEqual(LOG_LEVEL.WARN);

	});

	it("#log should log message and take first argument as log level", () => {

		const mock = mockLoggerFacilityWithTarget("fac");

		mock.facility.log(LOG_LEVEL.INFO, "arg1", "arg2");

		expect(mock.target.log).toHaveBeenLastCalledWith(LOG_LEVEL.INFO, "fac", ["arg1", "arg2"], {});

	});

	it("#debug should log message with DEBUG level", () => {

		const mock = mockLoggerFacilityWithTarget("fac");

		mock.facility.debug("arg1", "arg2");

		expect(mock.target.log).toHaveBeenLastCalledWith(LOG_LEVEL.DEBUG, "fac", ["arg1", "arg2"], {});

	});

	it("#info should log message with INFO level", () => {

		const mock = mockLoggerFacilityWithTarget("fac");

		mock.facility.info("arg1", "arg2");

		expect(mock.target.log).toHaveBeenLastCalledWith(LOG_LEVEL.INFO, "fac", ["arg1", "arg2"], {});

	});

	it("#notice should log message with NOTICE level", () => {

		const mock = mockLoggerFacilityWithTarget("fac");

		mock.facility.notice("arg1", "arg2");

		expect(mock.target.log).toHaveBeenLastCalledWith(LOG_LEVEL.NOTICE, "fac", ["arg1", "arg2"], {});

	});

	it("#warn should log message with WARN level", () => {

		const mock = mockLoggerFacilityWithTarget("fac");

		mock.facility.warn("arg1", "arg2");

		expect(mock.target.log).toHaveBeenLastCalledWith(LOG_LEVEL.WARN, "fac", ["arg1", "arg2"], {});

	});

	it("#error should log message with ERROR level", () => {

		const mock = mockLoggerFacilityWithTarget("fac");

		mock.facility.error("arg1", "arg2");

		expect(mock.target.log).toHaveBeenLastCalledWith(LOG_LEVEL.ERROR, "fac", ["arg1", "arg2"], {});

	});

	it("#crit should log message with CRITICAL level", () => {

		const mock = mockLoggerFacilityWithTarget("fac");

		mock.facility.crit("arg1", "arg2");

		expect(mock.target.log).toHaveBeenLastCalledWith(LOG_LEVEL.CRITICAL, "fac", ["arg1", "arg2"], {});

	});

	it("#alert should log message with ALERT level", () => {

		const mock = mockLoggerFacilityWithTarget("fac");

		mock.facility.alert("arg1", "arg2");

		expect(mock.target.log).toHaveBeenLastCalledWith(LOG_LEVEL.ALERT, "fac", ["arg1", "arg2"], {});

	});

	it("#emerg should log message with EMERGENCY level", () => {

		const mock = mockLoggerFacilityWithTarget("fac");

		mock.facility.emerg("arg1", "arg2");

		expect(mock.target.log).toHaveBeenLastCalledWith(LOG_LEVEL.EMERGENCY, "fac", ["arg1", "arg2"], {});

	});

	it("#panic should log message with EMERGENCY level", () => {

		const mock = mockLoggerFacilityWithTarget("fac");

		mock.facility.panic("arg1", "arg2");

		expect(mock.target.log).toHaveBeenLastCalledWith(LOG_LEVEL.EMERGENCY, "fac", ["arg1", "arg2"], {});

	});

	it("#setLevel should change log level", () => {

		const mock = mockLoggerFacilityWithTarget("fac");

		mock.facility.setLevel(LOG_LEVEL.INFO);

		mock.facility.debug("arg1", "arg2");

		expect(mock.facility.getLevel()).toEqual(LOG_LEVEL.INFO);
		expect(mock.target.log).toHaveBeenCalledTimes(0);

	});

});
