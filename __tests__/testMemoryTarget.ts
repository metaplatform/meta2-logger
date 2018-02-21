/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import colors = require("colors");
import {LOG_LEVEL, MemoryTarget, IMemoryTargetOptions} from "../src/index";

describe("ConsoleTarget class", () => {

	function mockTarget(opts: IMemoryTargetOptions = { level: LOG_LEVEL.DEBUG }) {

		return new MemoryTarget(opts);

	}

	it("should construct", () => {

		const target = new MemoryTarget({
			level: LOG_LEVEL.DEBUG
		});

		expect(target).toBeInstanceOf(MemoryTarget);

	});

	it("should log message", () => {

		const target = mockTarget();

		target.log(LOG_LEVEL.INFO, null, [ "msg" ], { key: "value" });

		const messages = target.getMessages();

		expect(messages.length).toEqual(1);
		expect(messages[0]).toHaveProperty("timestamp");
		expect(messages[0].level).toEqual(LOG_LEVEL.INFO);
		expect(messages[0].facility).toEqual(null);
		expect(messages[0].meta).toEqual({ key: "value" });
		expect(messages[0].message).toEqual("msg");

	});

	it("should log message with facility", () => {

		const target = mockTarget();

		target.log(LOG_LEVEL.INFO, "fac", [ "msg" ], {});

		const messages = target.getMessages();

		expect(messages.length).toEqual(1);
		expect(messages[0]).toHaveProperty("timestamp");
		expect(messages[0].level).toEqual(LOG_LEVEL.INFO);
		expect(messages[0].facility).toEqual("fac");
		expect(messages[0].meta).toEqual({});
		expect(messages[0].message).toEqual("msg");

	});

	// ---

	it("should log message with higher severity", () => {

		const target = mockTarget({
			level: LOG_LEVEL.INFO
		});

		target.log(LOG_LEVEL.ALERT, "fac", [ "msg" ], {});

		const messages = target.getMessages();

		expect(messages.length).toEqual(1);
		expect(messages[0].level).toEqual(LOG_LEVEL.ALERT);
		expect(messages[0].facility).toEqual("fac");
		expect(messages[0].message).toEqual("msg");

	});

	it("should log message with equal severity", () => {

		const target = mockTarget({
			level: LOG_LEVEL.INFO
		});

		target.log(LOG_LEVEL.INFO, "fac", [ "msg" ], {});

		const messages = target.getMessages();

		expect(messages.length).toEqual(1);
		expect(messages[0].level).toEqual(LOG_LEVEL.INFO);
		expect(messages[0].facility).toEqual("fac");
		expect(messages[0].message).toEqual("msg");

	});

	it("should NOT log message with lower severity", () => {

		const target = mockTarget({
			level: LOG_LEVEL.INFO
		});

		target.log(LOG_LEVEL.DEBUG, "fac", [ "msg" ], {});

		const messages = target.getMessages();

		expect(messages.length).toEqual(0);

	});

	it("should log message within configured facilities", () => {

		const target = mockTarget({
			level: LOG_LEVEL.DEBUG,
			facilities: [ "test" ]
		});

		target.log(LOG_LEVEL.ERROR, "test", [ "msg" ], {});

		const messages = target.getMessages();

		expect(messages.length).toEqual(1);
		expect(messages[0].level).toEqual(LOG_LEVEL.ERROR);
		expect(messages[0].facility).toEqual("test");
		expect(messages[0].message).toEqual("msg");

	});

	it("should NOT log message out of configured facilities", () => {

		const target = mockTarget({
			level: LOG_LEVEL.DEBUG,
			facilities: [ "test" ]
		});

		target.log(LOG_LEVEL.ERROR, "fac", [ "msg" ], {});

		const messages = target.getMessages();

		expect(messages.length).toEqual(0);

	});

	it("should log properly formatted message", () => {

		const target = mockTarget();

		target.log(LOG_LEVEL.ALERT, "fac", [ "testStr %s: %d", "sub", 42 ], {});

		const messages = target.getMessages();

		expect(messages.length).toEqual(1);
		expect(messages[0].level).toEqual(LOG_LEVEL.ALERT);
		expect(messages[0].facility).toEqual("fac");
		expect(messages[0].message).toEqual("testStr sub: 42");

	});

	it("should not exceed message limit", () => {

		const target = mockTarget({
			level: LOG_LEVEL.DEBUG,
			limit: 2
		});

		target.log(LOG_LEVEL.INFO, null, [ "msg" ], { key: "value" });
		target.log(LOG_LEVEL.INFO, null, [ "msg" ], { key: "value" });
		target.log(LOG_LEVEL.INFO, null, [ "msg" ], { key: "value" });

		const messages = target.getMessages();

		expect(messages.length).toEqual(2);

	});

});
