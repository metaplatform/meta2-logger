/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import {ILogger, LOG_LEVEL} from "./interfaces";
import {Logger} from "./Logger";

/**
 * Facility class
 */
export class LoggerFacility implements ILogger {

	/**
	 * Facility constructor
	 *
	 * @param logger Logger instance
	 * @param prefix Facility name
	 */
	public constructor(protected logger: Logger, protected prefix: string) {}

	/**
	 * Logs message - first argument MUST be log level (from enum = number)
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * facility.log(LOG_LEVEL.INFO, "Formatted %s message, code %d", "info", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public log(...args) {

		const params = Array.prototype.slice.call(args);
		const level = params.shift();

		this.logger._log(level, this.prefix, params);

	}

	/**
	 * Log DEBUG level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * facility.debug("Formatted %s message, code %d", "debug", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public debug(...args) {

		this.logger._log(LOG_LEVEL.DEBUG, this.prefix, Array.prototype.slice.call(args));

	}

	/**
	 * Log INFO level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * facility.info("Formatted %s message, code %d", "info", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public info(...args) {

		this.logger._log(LOG_LEVEL.INFO, this.prefix, Array.prototype.slice.call(args));

	}

	/**
	 * Log NOTICE level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * facility.notice("Formatted %s message, code %d", "notice", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public notice(...args) {

		this.logger._log(LOG_LEVEL.NOTICE, this.prefix, Array.prototype.slice.call(args));

	}

	/**
	 * Log WARN level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * facility.warn("Formatted %s message, code %d", "warn", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public warn(...args) {

		this.logger._log(LOG_LEVEL.WARN, this.prefix, Array.prototype.slice.call(args));

	}

	/**
	 * Log WARN level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * facility.warn("Formatted %s message, code %d", "warn", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public warning(...args) {

		this.logger._log(LOG_LEVEL.WARN, this.prefix, Array.prototype.slice.call(args));

	}

	/**
	 * Log ERROR level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * facility.error("Formatted %s message, code %d", "error", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public error(...args) {

		this.logger._log(LOG_LEVEL.ERROR, this.prefix, Array.prototype.slice.call(args));

	}

	/**
	 * Log CRITICAL level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * facility.crit("Formatted %s message, code %d", "critical", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public crit(...args) {

		this.logger._log(LOG_LEVEL.CRITICAL, this.prefix, Array.prototype.slice.call(args));

	}

	/**
	 * Log ALERT level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * facility.alert("Formatted %s message, code %d", "alert", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public alert(...args) {

		this.logger._log(LOG_LEVEL.ALERT, this.prefix, Array.prototype.slice.call(args));

	}

	/**
	 * Log EMERGENCY level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * facility.emerg("Formatted %s message, code %d", "emergency", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public emerg(...args) {

		this.logger._log(LOG_LEVEL.EMERGENCY, this.prefix, Array.prototype.slice.call(args));

	}

	/**
	 * Log EMERGENCY level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * facility.panic("Formatted %s message, code %d", "emergency panic", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public panic(...args) {

		this.logger._log(LOG_LEVEL.EMERGENCY, this.prefix, Array.prototype.slice.call(args));

	}

}
