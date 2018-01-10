/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import colors = require("colors");
import {LOG_LEVEL, ConsoleTarget, IConsoleTargetOptions} from "../src/index";

describe("ConsoleTarget class", () => {

	function mockTarget(opts: IConsoleTargetOptions = { level: LOG_LEVEL.DEBUG }) {

		return new ConsoleTarget(opts);

	}

	function mockConsole() {

		const mem = { output: null };
		const consoleMock = jest.spyOn(global.console, "log");

		consoleMock.mockImplementation((args) => {

			mem.output = args;

		});

		return mem;

	}

	it("should construct", () => {

		const target = new ConsoleTarget({
			level: LOG_LEVEL.DEBUG
		});

		expect(target).toBeInstanceOf(ConsoleTarget);

	});

	it("should log message", () => {

		const consoleMock = mockConsole();

		mockTarget({ timestamp: false, colorize: false, level: LOG_LEVEL.DEBUG })
			.log(LOG_LEVEL.INFO, null, [ "msg" ], {});

		expect(consoleMock.output).toEqual("info: msg");

	});

	it("should log message with higher severity", () => {

		const consoleMock = mockConsole();

		mockTarget({ timestamp: false, colorize: false, level: LOG_LEVEL.INFO })
			.log(LOG_LEVEL.ALERT, null, [ "msg" ], {});

		expect(consoleMock.output).toEqual("alert: msg");

	});

	it("should log message with equal severity", () => {

		const consoleMock = mockConsole();

		mockTarget({ timestamp: false, colorize: false, level: LOG_LEVEL.INFO })
			.log(LOG_LEVEL.INFO, null, [ "msg" ], {});

		expect(consoleMock.output).toEqual("info: msg");

	});

	it("should NOT log message with lower severity", () => {

		const consoleMock = mockConsole();

		mockTarget({ timestamp: false, colorize: false, level: LOG_LEVEL.INFO })
			.log(LOG_LEVEL.DEBUG, null, [ "msg" ], {});

		expect(consoleMock.output).toEqual(null);

	});

	it("should log message within specified facility", () => {

		const consoleMock = mockConsole();

		mockTarget({ timestamp: false, colorize: false, level: LOG_LEVEL.DEBUG, facilities: [ "test" ] })
			.log(LOG_LEVEL.INFO, "test", [ "msg" ], {});

		expect(consoleMock.output).toEqual("info: [test] msg");

	});

	it("should NOT log message out of specified facilities", () => {

		const consoleMock = mockConsole();

		mockTarget({ timestamp: false, colorize: false, level: LOG_LEVEL.DEBUG, facilities: [ "test" ] })
			.log(LOG_LEVEL.INFO, "blah", [ "msg" ], {});

		expect(consoleMock.output).toEqual(null);

	});

	it("should log properly formatted message", () => {

		const consoleMock = mockConsole();

		mockTarget({ timestamp: false, colorize: false, level: LOG_LEVEL.DEBUG })
			.log(LOG_LEVEL.INFO, "fac", [ "testStr %s: %d", "sub", 42 ], {});

		expect(consoleMock.output).toEqual("info: [fac] testStr sub: 42");

	});

	it("should log message with timestamp", () => {

		const consoleMock = mockConsole();

		mockTarget({ timestamp: true, colorize: false, level: LOG_LEVEL.DEBUG })
			.log(LOG_LEVEL.INFO, null, [ "msg" ], {});

		expect(consoleMock.output).toMatch(/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2} info: msg/);

	});

	it("should print colorized messages", () => {

		const consoleMock = mockConsole();

		mockTarget({ timestamp: false, colorize: true, level: LOG_LEVEL.DEBUG })
			.log(LOG_LEVEL.DEBUG, null, [ "msg" ], {});

		expect(consoleMock.output).toEqual(colors.cyan("debug: msg"));

	});

	it("should log meta-data", () => {

		const consoleMock = mockConsole();

		mockTarget({ timestamp: false, colorize: false, level: LOG_LEVEL.DEBUG })
			.log(LOG_LEVEL.DEBUG, "facility", [ "msg" ], { key: "value" });

		expect(consoleMock.output).toEqual("debug: [facility] (key=value) msg");

	});

});
