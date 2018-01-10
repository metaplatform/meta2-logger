/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import TestConsole = require("test-console");
import {LOG_LEVEL, BaseTarget, IBaseTargetOptions} from "../src/index";

describe("ConsoleTarget class", () => {

	class MyTarget extends BaseTarget {

		public constructor(protected writeCb, opts: IBaseTargetOptions) {
			super(opts);
		}

		protected write(level: LOG_LEVEL, facility: string, msg: Array<string>) {
			this.writeCb.call(null, level, facility, msg);
		}

	}

	function mockTarget(opts: IBaseTargetOptions) {

		const out = {
			level: null,
			facility: null,
			msg: null
		};

		const writeMock = jest.fn((level, facility, msg) => {

			out.level = level;
			out.facility = facility;
			out.msg = msg;

		});

		const target = new MyTarget(writeMock, opts);

		return {
			target: target,
			write: writeMock,
			output: out
		};

	}

	it("should construct", () => {

		const target = new MyTarget(null, {
			level: LOG_LEVEL.DEBUG
		});

		expect(target).toBeInstanceOf(BaseTarget);

	});

	it("should log message", () => {

		const mock = mockTarget({
			timestamp: false,
			level: LOG_LEVEL.DEBUG
		});

		mock.target.log(LOG_LEVEL.INFO, null, [ "msg" ], {});

		expect(mock.write).toHaveBeenCalled();
		expect(mock.output.level).toEqual(LOG_LEVEL.INFO);
		expect(mock.output.facility).toEqual(null);
		expect(mock.output.msg).toEqual([ "info:", "msg" ]);

	});

	it("should log message with facility", () => {

		const mock = mockTarget({
			timestamp: false,
			level: LOG_LEVEL.DEBUG
		});

		mock.target.log(LOG_LEVEL.INFO, "fac", [ "msg" ], {});

		expect(mock.output.level).toEqual(LOG_LEVEL.INFO);
		expect(mock.output.facility).toEqual("fac");
		expect(mock.output.msg).toEqual([ "info:", "[fac]", "msg" ]);

	});

	it("should log message with higher severity", () => {

		const mock = mockTarget({
			timestamp: false,
			level: LOG_LEVEL.INFO
		});

		mock.target.log(LOG_LEVEL.ALERT, "fac", [ "msg" ], {});

		expect(mock.output.level).toEqual(LOG_LEVEL.ALERT);
		expect(mock.output.facility).toEqual("fac");
		expect(mock.output.msg).toEqual([ "alert:", "[fac]", "msg" ]);

	});

	it("should log message with equal severity", () => {

		const mock = mockTarget({
			timestamp: false,
			level: LOG_LEVEL.INFO
		});

		mock.target.log(LOG_LEVEL.INFO, "fac", [ "msg" ], {});

		expect(mock.output.level).toEqual(LOG_LEVEL.INFO);
		expect(mock.output.facility).toEqual("fac");
		expect(mock.output.msg).toEqual([ "info:", "[fac]", "msg" ]);

	});

	it("should NOT log message with lower severity", () => {

		const mock = mockTarget({
			timestamp: false,
			level: LOG_LEVEL.INFO
		});

		mock.target.log(LOG_LEVEL.DEBUG, "fac", [ "msg" ], {});

		expect(mock.write).not.toBeCalled();
		expect(mock.output.level).toEqual(null);
		expect(mock.output.facility).toEqual(null);
		expect(mock.output.msg).toEqual(null);

	});

	it("should log message within configured facilities", () => {

		const mock = mockTarget({
			timestamp: false,
			level: LOG_LEVEL.DEBUG,
			facilities: [ "test" ]
		});

		mock.target.log(LOG_LEVEL.ERROR, "test", [ "msg" ], {});

		expect(mock.output.level).toEqual(LOG_LEVEL.ERROR);
		expect(mock.output.facility).toEqual("test");
		expect(mock.output.msg).toEqual([ "error:", "[test]", "msg" ]);

	});

	it("should NOT log message out of configured facilities", () => {

		const mock = mockTarget({
			timestamp: false,
			level: LOG_LEVEL.DEBUG,
			facilities: [ "test" ]
		});

		mock.target.log(LOG_LEVEL.ERROR, "fac", [ "msg" ], {});

		expect(mock.write).not.toBeCalled();
		expect(mock.output.level).toEqual(null);
		expect(mock.output.facility).toEqual(null);
		expect(mock.output.msg).toEqual(null);

	});

	it("should log properly formatted message", () => {

		const mock = mockTarget({
			timestamp: false,
			level: LOG_LEVEL.DEBUG,
		});

		mock.target.log(LOG_LEVEL.ALERT, "fac", [ "testStr %s: %d", "sub", 42 ], {});

		expect(mock.output.level).toEqual(LOG_LEVEL.ALERT);
		expect(mock.output.facility).toEqual("fac");
		expect(mock.output.msg).toEqual([ "alert:", "[fac]", "testStr sub: 42" ]);

	});

	it("should log message with timestamp", () => {

		const mock = mockTarget({
			timestamp: true,
			level: LOG_LEVEL.DEBUG,
		});

		mock.target.log(LOG_LEVEL.ALERT, "fac", [ "msg" ], {});

		expect(mock.output.level).toEqual(LOG_LEVEL.ALERT);
		expect(mock.output.facility).toEqual("fac");
		expect(mock.output.msg[0]).toMatch(/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/);
		expect(mock.output.msg.slice(1)).toEqual([ "alert:", "[fac]", "msg" ]);

	});

});
