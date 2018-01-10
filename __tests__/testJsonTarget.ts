/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import os = require("os");
import fs = require("fs");

import {LOG_LEVEL, JsonFileTarget, IFileTargetOptions} from "../src/index";
import { exists } from "fs";

describe("JsonTarget class", () => {

	const logFilenameBase = os.tmpdir() + "/meta2-logger-jsonTarget-test.log.";

	const logFilenames = {
		construct: logFilenameBase + "construct",
		log1: logFilenameBase + "log1",
		logMulti: logFilenameBase + "logMulti",
		lower: logFilenameBase + "lower",
		higher: logFilenameBase + "higher",
		equal: logFilenameBase + "equal",
		inFacility: logFilenameBase + "inFacility",
		outFacility: logFilenameBase + "outFacility",
		formatted: logFilenameBase + "formatted",
		withTimestamp: logFilenameBase + "withTimestamp",
		metaData: logFilenameBase + "metaData"
	};

	const writeTimeout = 60;

	function parseLog(filename) {

		const log = fs.readFileSync(filename, { encoding: "utf-8" });

		return JSON.parse("[" + log + "]");

	}

	afterAll(() => {

		// tslint:disable-next-line:forin
		for (const i in logFilenames) {

			try {

				fs.statSync(logFilenames[i]);
				fs.unlinkSync(logFilenames[i]);

			} catch (err) {
				// Pass
			}

		}

	});

	it("should construct", () => {

		const target = new JsonFileTarget(logFilenames.construct, {
			level: LOG_LEVEL.DEBUG
		});

		expect(target).toBeInstanceOf(JsonFileTarget);

	});

	it("should log message", (done) => {

		const target = new JsonFileTarget(logFilenames.log1, {
			level: LOG_LEVEL.DEBUG
		});

		target.log(LOG_LEVEL.INFO, null, [ "msg" ], {});

		setTimeout(() => {

			target.close();
			const log = parseLog(logFilenames.log1);

			expect(log).toHaveLength(2);
			expect(log[1]).toHaveProperty("timestamp");
			expect(log[1].level).toEqual(LOG_LEVEL.INFO);
			expect(log[1].facility).toEqual(null);
			expect(log[1].msg).toEqual([ "msg" ]);

			done();

		}, writeTimeout);

	});

	it("should append multiple messages", (done) => {

		const target = new JsonFileTarget(logFilenames.logMulti, {
			level: LOG_LEVEL.DEBUG,
			timestamp: false
		});

		target.log(LOG_LEVEL.INFO, null, [ "msg1" ], {});
		target.log(LOG_LEVEL.DEBUG, null, [ "msg2" ], {});

		setTimeout(() => {

			target.close();
			const log = parseLog(logFilenames.logMulti);

			expect(log).toHaveLength(3);

			expect(log[1]).toHaveProperty("timestamp");
			expect(log[1].level).toEqual(LOG_LEVEL.INFO);
			expect(log[1].facility).toEqual(null);
			expect(log[1].msg).toEqual([ "msg1" ]);

			expect(log[2]).toHaveProperty("timestamp");
			expect(log[2].level).toEqual(LOG_LEVEL.DEBUG);
			expect(log[2].facility).toEqual(null);
			expect(log[2].msg).toEqual([ "msg2" ]);

			done();

		}, writeTimeout * 2);

	});

	it("should log message with higher severity", (done) => {

		const target = new JsonFileTarget(logFilenames.higher, {
			level: LOG_LEVEL.INFO,
			timestamp: false
		});

		target.log(LOG_LEVEL.ALERT, null, [ "msg" ], {});

		setTimeout(() => {

			target.close();
			const log = parseLog(logFilenames.higher);

			expect(log).toHaveLength(2);
			expect(log[1]).toHaveProperty("timestamp");
			expect(log[1].level).toEqual(LOG_LEVEL.ALERT);
			expect(log[1].facility).toEqual(null);
			expect(log[1].msg).toEqual([ "msg" ]);

			done();

		}, writeTimeout);

	});

	it("should log message with equal severity", (done) => {

		const target = new JsonFileTarget(logFilenames.equal, {
			level: LOG_LEVEL.INFO,
			timestamp: false
		});

		target.log(LOG_LEVEL.INFO, null, [ "msg" ], {});

		setTimeout(() => {

			target.close();
			const log = parseLog(logFilenames.equal);

			expect(log).toHaveLength(2);
			expect(log[1]).toHaveProperty("timestamp");
			expect(log[1].level).toEqual(LOG_LEVEL.INFO);
			expect(log[1].facility).toEqual(null);
			expect(log[1].msg).toEqual([ "msg" ]);

			done();

		}, writeTimeout);

	});

	it("should NOT log message with lower severity", (done) => {

		const target = new JsonFileTarget(logFilenames.lower, {
			level: LOG_LEVEL.INFO,
			timestamp: false
		});

		target.log(LOG_LEVEL.INFO, null, [ "msg" ], {});
		target.log(LOG_LEVEL.DEBUG, null, [ "msg" ], {});

		setTimeout(() => {

			target.close();
			const log = parseLog(logFilenames.lower);

			expect(log).toHaveLength(2);
			expect(log[1]).toHaveProperty("timestamp");
			expect(log[1].level).toEqual(LOG_LEVEL.INFO);
			expect(log[1].facility).toEqual(null);
			expect(log[1].msg).toEqual([ "msg" ]);
			expect(log[2]).toBeUndefined();

			done();

		}, writeTimeout);

	});

	it("should log message within specified facility", (done) => {

		const target = new JsonFileTarget(logFilenames.inFacility, {
			level: LOG_LEVEL.INFO,
			timestamp: false,
			facilities: [ "test" ]
		});

		target.log(LOG_LEVEL.INFO, "test", [ "msg" ], {});

		setTimeout(() => {

			target.close();
			const log = parseLog(logFilenames.inFacility);

			expect(log).toHaveLength(2);
			expect(log[1]).toHaveProperty("timestamp");
			expect(log[1].level).toEqual(LOG_LEVEL.INFO);
			expect(log[1].facility).toEqual("test");
			expect(log[1].msg).toEqual([ "msg" ]);

			done();

		}, writeTimeout);

	});

	it("should NOT log message out of specified facility", (done) => {

		const target = new JsonFileTarget(logFilenames.outFacility, {
			level: LOG_LEVEL.INFO,
			timestamp: false,
			facilities: [ "test" ]
		});

		target.log(LOG_LEVEL.INFO, "test", [ "msg" ], {});
		target.log(LOG_LEVEL.DEBUG, "fac", [ "msg" ], {});

		setTimeout(() => {

			target.close();
			const log = parseLog(logFilenames.outFacility);

			expect(log).toHaveLength(2);
			expect(log[1]).toHaveProperty("timestamp");
			expect(log[1].level).toEqual(LOG_LEVEL.INFO);
			expect(log[1].facility).toEqual("test");
			expect(log[1].msg).toEqual([ "msg" ]);
			expect(log[2]).toBeUndefined();
			done();

		}, writeTimeout);

	});

	it("should log message arguments", (done) => {

		const target = new JsonFileTarget(logFilenames.formatted, {
			level: LOG_LEVEL.INFO,
			timestamp: false,
		});

		target.log(LOG_LEVEL.INFO, "fac", [ "testStr %s: %d", "sub", 42 ], {});

		setTimeout(() => {

			target.close();
			const log = parseLog(logFilenames.formatted);

			expect(log).toHaveLength(2);
			expect(log[1]).toHaveProperty("timestamp");
			expect(log[1].level).toEqual(LOG_LEVEL.INFO);
			expect(log[1].facility).toEqual("fac");
			expect(log[1].msg).toEqual([ "testStr %s: %d", "sub", 42 ]);

			done();

		}, writeTimeout);

	});

	it("should log message meta-data", (done) => {

		const target = new JsonFileTarget(logFilenames.metaData, {
			level: LOG_LEVEL.INFO,
			timestamp: false,
		});

		target.log(LOG_LEVEL.INFO, "fac", [ "msg" ], { key: "value" });

		setTimeout(() => {

			target.close();
			const log = parseLog(logFilenames.metaData);

			expect(log).toHaveLength(2);
			expect(log[1]).toHaveProperty("timestamp");
			expect(log[1].level).toEqual(LOG_LEVEL.INFO);
			expect(log[1].facility).toEqual("fac");
			expect(log[1].msg).toEqual([ "msg" ]);
			expect(log[1].meta).toMatchObject({
				key: "value"
			});

			done();

		}, writeTimeout);

	});

});
