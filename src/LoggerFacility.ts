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
 * Logger facility configuration
 */
export interface ILoggerFacilityConfig {
	level?: LOG_LEVEL;
}

/**
 * Facility class
 */
export class LoggerFacility implements ILogger {

	/** Facility log level */
	protected level: LOG_LEVEL;

	/**
	 * Facility constructor
	 *
	 * @param logger Logger instance
	 * @param prefix Facility name
	 * @param config Facility configuration
	 */
	public constructor(protected logger: Logger, protected prefix: string, config: ILoggerFacilityConfig = {}) {

		this.level = config.level || LOG_LEVEL.DEBUG;

	}

	/**
	 * Sets log level
	 *
	 * @param level New log level
	 */
	public setLevel(level: LOG_LEVEL) {

		this.level = level;

	}

	/**
	 * Returns log level
	 */
	public getLevel() {

		return this.level;

	}

	/**
	 * Internal log method that pass log message to parent logger - DO NOT USE DIRECTLY!
	 *
	 * @internal
	 * @param level Log level
	 * @param args Message arguments
	 */
	public _log(level: LOG_LEVEL, args: any) {

		if (level > this.level) return;

		this.logger._log(level, this.prefix, args);

	}

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

		this._log(level, params);

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

		this._log(LOG_LEVEL.DEBUG, Array.prototype.slice.call(args));

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

		this._log(LOG_LEVEL.INFO, Array.prototype.slice.call(args));

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

		this._log(LOG_LEVEL.NOTICE, Array.prototype.slice.call(args));

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

		this._log(LOG_LEVEL.WARN, Array.prototype.slice.call(args));

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

		this._log(LOG_LEVEL.WARN, Array.prototype.slice.call(args));

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

		this._log(LOG_LEVEL.ERROR, Array.prototype.slice.call(args));

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

		this._log(LOG_LEVEL.CRITICAL, Array.prototype.slice.call(args));

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

		this._log(LOG_LEVEL.ALERT, Array.prototype.slice.call(args));

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

		this._log(LOG_LEVEL.EMERGENCY, Array.prototype.slice.call(args));

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

		this._log(LOG_LEVEL.EMERGENCY, Array.prototype.slice.call(args));

	}

}
