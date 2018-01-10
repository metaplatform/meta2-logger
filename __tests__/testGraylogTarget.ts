/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import dgram = require("dgram");
import {LOG_LEVEL, GraylogTarget, IGraylogTargetOptions} from "../src/index";

describe("GraylogTarget class", () => {

	function mockTarget(opts: IGraylogTargetOptions) {

		const target = new GraylogTarget(opts);

		target.close();

		const _target = target as any;
		const output = { payload: null };

		_target.send = jest.fn((payload) => {
			output.payload = payload;
		});

		return {
			target: target,
			send: _target.send,
			output: output
		};

	}

	it("should construct", () => {

		const target = new GraylogTarget({
			level: LOG_LEVEL.DEBUG,
			graylogHostname: "localhost"
		});

		target.close();

		expect(target).toBeInstanceOf(GraylogTarget);

	});

	it("should log message", () => {

		const mock = mockTarget({
			level: LOG_LEVEL.DEBUG,
			graylogHostname: "localhost"
		});

		mock.target.log(LOG_LEVEL.INFO, null, [ "msg" ], {});

		expect(mock.send).toHaveBeenCalled();
		expect(mock.output.payload).toMatchObject({
			full_message: "msg",
			host: "_unspecified_",
			level: mock.target.logLevelMap[LOG_LEVEL.INFO],
			short_message: "msg",
			version: "1.0",
		});

	});

	it("should log message with version 1.1", () => {

		const mock = mockTarget({
			level: LOG_LEVEL.DEBUG,
			graylogHostname: "localhost",
			version: "1.1"
		});

		mock.target.log(LOG_LEVEL.INFO, null, [ "msg" ], {});

		expect(mock.send).toHaveBeenCalled();
		expect(mock.output.payload).toMatchObject({
			full_message: "msg",
			host: "_unspecified_",
			level: mock.target.logLevelMap[LOG_LEVEL.INFO],
			short_message: "msg",
			version: "1.1",
		});

	});

	it("should log message with host defined", () => {

		const mock = mockTarget({
			level: LOG_LEVEL.DEBUG,
			graylogHostname: "localhost",
			host: "myHost"
		});

		mock.target.log(LOG_LEVEL.INFO, null, [ "msg" ], {});

		expect(mock.send).toHaveBeenCalled();
		expect(mock.output.payload).toMatchObject({
			full_message: "msg",
			host: "myHost",
			level: mock.target.logLevelMap[LOG_LEVEL.INFO],
			short_message: "msg",
			version: "1.0",
		});

	});

	it("should log message with additional fields", () => {

		const mock = mockTarget({
			level: LOG_LEVEL.DEBUG,
			graylogHostname: "localhost",
			additionalFields: {
				key: "val"
			}
		});

		mock.target.log(LOG_LEVEL.INFO, null, [ "msg" ], {});

		expect(mock.send).toHaveBeenCalled();
		expect(mock.output.payload).toMatchObject({
			full_message: "msg",
			host: "_unspecified_",
			level: mock.target.logLevelMap[LOG_LEVEL.INFO],
			short_message: "msg",
			version: "1.0",
			_key: "val"
		});

	});

	it("should log message with facility", () => {

		const mock = mockTarget({
			graylogHostname: "localhost",
			level: LOG_LEVEL.DEBUG
		});

		mock.target.log(LOG_LEVEL.INFO, "fac", [ "msg" ], {});

		expect(mock.send).toHaveBeenCalled();
		expect(mock.output.payload).toMatchObject({
			level: mock.target.logLevelMap[LOG_LEVEL.INFO],
			short_message: "msg",
			full_message: "msg",
			_facility: "fac"
		});

	});

	it("should log message with higher severity", () => {

		const mock = mockTarget({
			graylogHostname: "localhost",
			level: LOG_LEVEL.INFO
		});

		mock.target.log(LOG_LEVEL.ALERT, "fac", [ "msg" ], {});

		expect(mock.send).toHaveBeenCalled();
		expect(mock.output.payload).toMatchObject({
			level: mock.target.logLevelMap[LOG_LEVEL.ALERT],
			short_message: "msg",
			full_message: "msg",
			_facility: "fac"
		});

	});

	it("should log message with equal severity", () => {

		const mock = mockTarget({
			graylogHostname: "localhost",
			level: LOG_LEVEL.INFO
		});

		mock.target.log(LOG_LEVEL.INFO, "fac", [ "msg" ], {});

		expect(mock.send).toHaveBeenCalled();
		expect(mock.output.payload).toMatchObject({
			level: mock.target.logLevelMap[LOG_LEVEL.INFO],
			short_message: "msg",
			full_message: "msg",
			_facility: "fac"
		});

	});

	it("should NOT log message with lower severity", () => {

		const mock = mockTarget({
			graylogHostname: "localhost",
			level: LOG_LEVEL.INFO
		});

		mock.target.log(LOG_LEVEL.DEBUG, "fac", [ "msg" ], {});

		expect(mock.send).not.toBeCalled();
		expect(mock.output.payload).toEqual(null);

	});

	it("should log message within configured facilities", () => {

		const mock = mockTarget({
			graylogHostname: "localhost",
			level: LOG_LEVEL.DEBUG,
			facilities: [ "test" ]
		});

		mock.target.log(LOG_LEVEL.ERROR, "test", [ "msg" ], {});

		expect(mock.send).toHaveBeenCalled();
		expect(mock.output.payload).toMatchObject({
			level: mock.target.logLevelMap[LOG_LEVEL.ERROR],
			short_message: "msg",
			full_message: "msg",
			_facility: "test"
		});

	});

	it("should NOT log message out of configured facilities", () => {

		const mock = mockTarget({
			graylogHostname: "localhost",
			level: LOG_LEVEL.DEBUG,
			facilities: [ "test" ]
		});

		mock.target.log(LOG_LEVEL.ERROR, "fac", [ "msg" ], {});

		expect(mock.send).not.toBeCalled();
		expect(mock.output.payload).toEqual(null);

	});

	it("should log properly formatted message", () => {

		const mock = mockTarget({
			graylogHostname: "localhost",
			level: LOG_LEVEL.DEBUG,
		});

		mock.target.log(LOG_LEVEL.ALERT, "fac", [ "testStr %s: %d", "sub", 42 ], {});

		expect(mock.send).toHaveBeenCalled();
		expect(mock.output.payload).toMatchObject({
			level: mock.target.logLevelMap[LOG_LEVEL.ALERT],
			short_message: "testStr sub: 42",
			full_message: "testStr sub: 42",
			_facility: "fac"
		});

	});

	it("should parse short message from first line", () => {

		const mock = mockTarget({
			graylogHostname: "localhost",
			level: LOG_LEVEL.DEBUG,
		});

		mock.target.log(LOG_LEVEL.CRITICAL, "fac", [ "First line %s\nSecond line: %d", "sub", 42 ], {});

		expect(mock.send).toHaveBeenCalled();
		expect(mock.output.payload).toMatchObject({
			level: mock.target.logLevelMap[LOG_LEVEL.CRITICAL],
			short_message: "First line sub",
			full_message: "First line sub\nSecond line: 42",
			_facility: "fac"
		});

	});

	it("should log message meta-data", () => {

		const mock = mockTarget({
			graylogHostname: "localhost",
			level: LOG_LEVEL.DEBUG,
		});

		mock.target.log(LOG_LEVEL.CRITICAL, "fac", [ "msg" ], { key: "value" });

		expect(mock.send).toHaveBeenCalled();
		expect(mock.output.payload).toMatchObject({
			level: mock.target.logLevelMap[LOG_LEVEL.CRITICAL],
			short_message: "msg",
			full_message: "msg",
			_facility: "fac",
			_key: "value"
		});

	});

	it("should send payload to server", (done) => {

		const serverPort = 11999;

		const target = new GraylogTarget({
			level: LOG_LEVEL.DEBUG,
			graylogHostname: "localhost",
			graylogPort: serverPort
		});

		const server = dgram.createSocket("udp4");

		server.on("message", (msg, rinfo) => {

			server.close();
			target.close();
			done();

		});

		target.log(LOG_LEVEL.NOTICE, null, [ "hello server" ], {});

		server.bind(serverPort);

	});

});
