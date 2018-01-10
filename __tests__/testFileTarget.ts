/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import os = require("os");
import fs = require("fs");

import {LOG_LEVEL, FileTarget, IFileTargetOptions} from "../src/index";

describe("FileTarget class", () => {

	const logFilenameBase = os.tmpdir() + "/meta2-logger-fileTarget-test.log.";

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

		const target = new FileTarget(logFilenames.construct, {
			level: LOG_LEVEL.DEBUG
		});

		expect(target).toBeInstanceOf(FileTarget);

	});

	it("should log message", (done) => {

		const target = new FileTarget(logFilenames.log1, {
			level: LOG_LEVEL.DEBUG,
			timestamp: false
		});

		target.log(LOG_LEVEL.INFO, null, [ "msg" ], {});

		setTimeout(() => {

			target.close();
			expect(fs.readFileSync(logFilenames.log1, { encoding: "utf-8" })).toEqual("info: msg\n");

			done();

		}, writeTimeout);

	});

	it("should append multiple messages", (done) => {

		const target = new FileTarget(logFilenames.logMulti, {
			level: LOG_LEVEL.DEBUG,
			timestamp: false
		});

		target.log(LOG_LEVEL.INFO, null, [ "msg1" ], {});
		target.log(LOG_LEVEL.DEBUG, null, [ "msg2" ], {});

		setTimeout(() => {

			target.close();
			expect(fs.readFileSync(logFilenames.logMulti, { encoding: "utf-8" })).toEqual("info: msg1\ndebug: msg2\n");
			done();

		}, writeTimeout * 2);

	});

	it("should log message with higher severity", (done) => {

		const target = new FileTarget(logFilenames.higher, {
			level: LOG_LEVEL.INFO,
			timestamp: false
		});

		target.log(LOG_LEVEL.ALERT, null, [ "msg" ], {});

		setTimeout(() => {

			target.close();
			expect(fs.readFileSync(logFilenames.higher, { encoding: "utf-8" })).toEqual("alert: msg\n");
			done();

		}, writeTimeout);

	});

	it("should log message with equal severity", (done) => {

		const target = new FileTarget(logFilenames.equal, {
			level: LOG_LEVEL.INFO,
			timestamp: false
		});

		target.log(LOG_LEVEL.INFO, null, [ "msg" ], {});

		setTimeout(() => {

			target.close();
			expect(fs.readFileSync(logFilenames.equal, { encoding: "utf-8" })).toEqual("info: msg\n");
			done();

		}, writeTimeout);

	});

	it("should NOT log message with lower severity", (done) => {

		const target = new FileTarget(logFilenames.lower, {
			level: LOG_LEVEL.INFO,
			timestamp: false
		});

		target.log(LOG_LEVEL.INFO, null, [ "msg" ], {});
		target.log(LOG_LEVEL.DEBUG, null, [ "msg" ], {});

		setTimeout(() => {

			target.close();
			expect(fs.readFileSync(logFilenames.lower, { encoding: "utf-8" })).toEqual("info: msg\n");
			done();

		}, writeTimeout);

	});

	it("should log message within specified facility", (done) => {

		const target = new FileTarget(logFilenames.inFacility, {
			level: LOG_LEVEL.INFO,
			timestamp: false,
			facilities: [ "test" ]
		});

		target.log(LOG_LEVEL.INFO, "test", [ "msg" ], {});

		setTimeout(() => {

			target.close();
			expect(fs.readFileSync(logFilenames.inFacility, { encoding: "utf-8" })).toEqual("info: [test] msg\n");
			done();

		}, writeTimeout);

	});

	it("should NOT log message out of specified facility", (done) => {

		const target = new FileTarget(logFilenames.outFacility, {
			level: LOG_LEVEL.INFO,
			timestamp: false,
			facilities: [ "test" ]
		});

		target.log(LOG_LEVEL.INFO, "test", [ "msg" ], {});
		target.log(LOG_LEVEL.DEBUG, "fac", [ "msg" ], {});

		setTimeout(() => {

			target.close();
			expect(fs.readFileSync(logFilenames.outFacility, { encoding: "utf-8" })).toEqual("info: [test] msg\n");
			done();

		}, writeTimeout);

	});

	it("should log properly formatted message", (done) => {

		const target = new FileTarget(logFilenames.formatted, {
			level: LOG_LEVEL.INFO,
			timestamp: false,
		});

		target.log(LOG_LEVEL.INFO, "fac", [ "testStr %s: %d", "sub", 42 ], {});

		setTimeout(() => {

			target.close();
			expect(fs.readFileSync(logFilenames.formatted, { encoding: "utf-8" })).toEqual("info: [fac] testStr sub: 42\n");
			done();

		}, writeTimeout);

	});

	it("should log message with timestamp", (done) => {

		const target = new FileTarget(logFilenames.withTimestamp, {
			level: LOG_LEVEL.INFO,
			timestamp: true,
		});

		target.log(LOG_LEVEL.INFO, null, [ "msg" ], {});

		setTimeout(() => {

			target.close();
			expect(
				fs.readFileSync(logFilenames.withTimestamp, { encoding: "utf-8" })
			).toMatch(/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2} info: msg\n/);

			done();

		}, writeTimeout);

	});

	it("should log meta-data", (done) => {

		const target = new FileTarget(logFilenames.metaData, {
			level: LOG_LEVEL.INFO,
			timestamp: false,
		});

		target.log(LOG_LEVEL.INFO, "facility", [ "msg" ], { key: "value" });

		setTimeout(() => {

			target.close();

			expect(
				fs.readFileSync(logFilenames.metaData, { encoding: "utf-8" })
			).toEqual("info: [facility] (key=value) msg\n");

			done();

		}, writeTimeout);

	});

});
