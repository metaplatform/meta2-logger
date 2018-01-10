/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import {parseLogLevel, LOG_LEVEL} from "../src/index";

describe("Utility functions", () => {

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

});
