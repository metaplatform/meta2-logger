/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import {ILogger, ILoggerTarget, LOG_LEVEL} from "./interfaces";
import {LoggerFacility} from "./LoggerFacility";

import {ConsoleTarget, IConsoleTargetOptions} from "./ConsoleTarget";
import {FileTarget, IFileTargetOptions} from "./FileTarget";
import {JsonFileTarget} from "./JsonFileTarget";
import {GraylogTarget, IGraylogTargetOptions} from "./GraylogTarget";

/**
 * Logger class
 */
export class Logger implements ILogger {

	/** Logging targets */
	protected targets: { [K: string]: ILoggerTarget } = {};

	/**
	 * Internal log method that pass log message to all targets
	 * @param level Log level
	 * @param facility Facility
	 * @param args Message arguments
	 */
	public _log(level: LOG_LEVEL, facility: string, args: any) {

		let meta = {};

		if (args[0] instanceof Object)
			meta = args.shift();

		for (const i in this.targets)
			this.targets[i].log.call(this.targets[i], level, facility, args, meta);

	}

	/**
	 * Logs message - first argument MUST be log level (from enum = number)
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * logger.log(LOG_LEVEL.INFO, "Formatted %s message, code %d", "info", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public log(...args) {

		const params = Array.prototype.slice.call(args);
		const level = params.shift();

		this._log(level, null, params);

	}

	/**
	 * Log DEBUG level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * logger.debug("Formatted %s message, code %d", "debug", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public debug(...args) {

		this._log(LOG_LEVEL.DEBUG, null, Array.prototype.slice.call(args));

	}

	/**
	 * Log INFO level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * logger.info("Formatted %s message, code %d", "info", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public info(...args) {

		this._log(LOG_LEVEL.INFO, null, Array.prototype.slice.call(args));

	}

	/**
	 * Log NOTICE level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * logger.notice("Formatted %s message, code %d", "notice", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public notice(...args) {

		this._log(LOG_LEVEL.NOTICE, null, Array.prototype.slice.call(args));

	}

	/**
	 * Log WARN level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * logger.warn("Formatted %s message, code %d", "warn", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public warn(...args) {

		this._log(LOG_LEVEL.WARN, null, Array.prototype.slice.call(args));

	}

	/**
	 * Log WARN level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * logger.warning("Formatted %s message, code %d", "warn", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public warning(...args) {

		this._log(LOG_LEVEL.WARN, null, Array.prototype.slice.call(args));

	}

	/**
	 * Log ERROR level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * logger.error("Formatted %s message, code %d", "error", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public error(...args) {

		this._log(LOG_LEVEL.ERROR, null, Array.prototype.slice.call(args));

	}

	/**
	 * Log CRITICAL level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * logger.crit("Formatted %s message, code %d", "critical", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public crit(...args) {

		this._log(LOG_LEVEL.CRITICAL, null, Array.prototype.slice.call(args));

	}

	/**
	 * Log ALERT level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * logger.alert("Formatted %s message, code %d", "alert", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public alert(...args) {

		this._log(LOG_LEVEL.ALERT, null, Array.prototype.slice.call(args));

	}

	/**
	 * Log EMERGENCY level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * logger.emerg("Formatted %s message, code %d", "emergency", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public emerg(...args) {

		this._log(LOG_LEVEL.EMERGENCY, null, Array.prototype.slice.call(args));

	}

	/**
	 * Log EMERGENCY level message
	 *
	 * Arguments are formatted the same way as the standard console.log() function does.
	 *
	 * Usage:
	 * ```
	 * logger.panic("Formatted %s message, code %d", "emergency panic", 123);
	 * ```
	 *
	 * @param args Message arguments
	 */
	public panic(...args) {

		this._log(LOG_LEVEL.EMERGENCY, null, Array.prototype.slice.call(args));

	}

	/**
	 * Create facility logger wrapper
	 *
	 * @param name Facility name
	 */
	public facility(name: string) {

		return new LoggerFacility(this, name);

	}

	/**
	 * Add logging target
	 *
	 * @param id Target unique ID
	 * @param target Target instance
	 */
	public to(id: string, target: ILoggerTarget) {

		this.targets[id] = target;
		return this;

	}

	/**
	 * Return all assigned logging targets
	 */
	public getAllTargets() {

		return this.targets;

	}

	/**
	 * Return target by ID
	 *
	 * @param id Logging target ID
	 */
	public getTarget(id: string) {

		return this.targets[id];

	}

	/**
	 * Add console target
	 *
	 * Overrides existings console target defined previously by this method.
	 *
	 * Usage:
	 *
	 * ```
	 * logger.toConsole({
	 * 	level: LOG_LEVEL.DEBUG,
	 * 	timestamp: true,
	 * 	facilities: [ "server", "broker" ],
	 * 	colorize: true
	 * });
	 * ```
	 *
	 * @param options Target options
	 */
	public toConsole(options: IConsoleTargetOptions = {}) {

		this.targets["__console__"] = new ConsoleTarget(options);
		return this;

	}

	/**
	 * Add file target
	 *
	 * Usage:
	 *
	 * ```
	 * logger.toFile("myLogFile.log", {
	 * 	level: LOG_LEVEL.DEBUG,
	 * 	timestamp: true,
	 * 	facilities: [ "server", "broker" ],
	 * });
	 * ```
	 *
	 * @param filename Log filename
	 * @param options Target options
	 */
	public toFile(filename: string, options: IFileTargetOptions = {}) {

		this.targets[filename] = new FileTarget(filename, options);
		return this;

	}

	/**
	 * Add JSON file target
	 *
	 * Usage:
	 *
	 * ```
	 * logger.toJsonFile("myLogFile.json", {
	 * 	level: LOG_LEVEL.DEBUG,
	 * 	timestamp: true,
	 * 	facilities: [ "server", "broker" ],
	 * });
	 * ```
	 *
	 * @param filename Log filename
	 * @param options Target options
	 */
	public toJsonFile(filename: string, options: IFileTargetOptions = {}) {

		this.targets[filename] = new JsonFileTarget(filename, options);
		return this;

	}

	/**
	 * Add GrayLog (GELF) target
	 *
	 * Overrides existings grayLog target defined previously by this method. Use `logger.to()` method to define
	 * multiple GrayLog targets.
	 *
	 * Usage:
	 *
	 * ```
	 * logger.toGrayLog({
	 * 	level: LOG_LEVEL.DEBUG,
	 * 	facilities: [ "server", "broker" ],
	 * 	graylogHostname: "localhost",
	 * 	graylogPort: 12201,
	 * 	connection: "lan",
	 * 	maxChunkSizeWan: 1420,
	 * 	maxChunkSizeLan: 8154,
	 * 	host: "myApp",
	 * 	facilityPrefix: "myAppPrefix_",
	 * 	version: "1.0",
	 * 	additionalFields: {
	 * 		myField: "myValue"
	 * 	},
	 * 	debugGelfClient: true
	 * });
	 * ```
	 *
	 * @param options Target options
	 */
	public toGrayLog(options: IGraylogTargetOptions) {

		this.targets["__graylog__"] = new GraylogTarget(options);
		return this;

	}

	/**
	 * Close I/O handles of all targets
	 */
	public close() {

		for (const i in this.targets)
			this.targets[i].close();

	}

}
