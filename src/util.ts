/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import {LOG_LEVEL} from "./interfaces";

export function parseLogLevel(level: string) {

	switch (level.toLowerCase()) {
		case "debug":
			return LOG_LEVEL.DEBUG;

		case "info":
			return LOG_LEVEL.INFO;

		case "notice":
			return LOG_LEVEL.NOTICE;

		case "warn":
		case "warning":
			return LOG_LEVEL.WARN;

		case "error":
			return LOG_LEVEL.ERROR;

		case "critical":
		case "crit":
			return LOG_LEVEL.CRITICAL;

		case "alert":
			return LOG_LEVEL.ALERT;

		case "emergency":
		case "panic":
		case "emerg":
			return LOG_LEVEL.EMERGENCY;
	}

	throw new Error("Unknown log level '" + level + "'");

}
