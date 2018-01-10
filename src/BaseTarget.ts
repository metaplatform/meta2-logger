/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import * as util from "util";
import {LOG_LEVEL, ILoggerTarget, ILoggerMetaData} from "./interfaces";

/**
 * Base logger target options
 */
export interface IBaseTargetOptions {

	/** Max log level */
	level?: LOG_LEVEL;

	/** Facilities - null for all */
	facilities?: Array<string>;

	/** If to include timestamp */
	timestamp? : boolean;
}

/**
 * Logger base target class
 */
export abstract class BaseTarget implements ILoggerTarget {

	protected level: LOG_LEVEL = LOG_LEVEL.INFO;
	protected facilities: Array<string> = [];
	protected timestamp: boolean = true;

	protected levelLabels = {};

	/**
	 * Base logger target constructor
	 *
	 * Usage:
	 *
	 * ```
	 * logger.to("someUniqueTargetId", new BaseTarget({
	 * 	level: LOG_LEVEL.DEBUG,
	 * 	timestamp: true,
	 * 	facilities: [ "server", "broker" ]
	 * }));
	 * ```
	 *
	 * @param options Target options
	 */
	public constructor(options: IBaseTargetOptions) {

		if (options.level) this.level = options.level;
		if (options.facilities) this.facilities = options.facilities;
		if (options.timestamp !== undefined) this.timestamp = options.timestamp;

		this.levelLabels[LOG_LEVEL.DEBUG] = "debug";
		this.levelLabels[LOG_LEVEL.INFO] = "info";
		this.levelLabels[LOG_LEVEL.NOTICE] = "notice";
		this.levelLabels[LOG_LEVEL.WARN] = "warn";
		this.levelLabels[LOG_LEVEL.ERROR] = "error";
		this.levelLabels[LOG_LEVEL.CRITICAL] = "critical";
		this.levelLabels[LOG_LEVEL.ALERT] = "alert";
		this.levelLabels[LOG_LEVEL.EMERGENCY] = "emergency";

	}

	/**
	 * Log message
	 *
	 * @param level Log level
	 * @param facility Facility
	 * @param args Message arguments
	 * @param meta Meta data
	 */
	public log(level: LOG_LEVEL, facility: string, args: Array<any>, meta: ILoggerMetaData) {

		if (level > this.level) return;
		if (this.facilities.length > 0 && this.facilities.indexOf(facility) < 0) return;

		const msg = [util.format.apply(this, args)];

		// Add meta data
		for (const i in meta)
			msg.unshift("(" + i + "=" + String(meta[i]) + ")");

		// Add facility
		if (facility)
			msg.unshift("[" + facility + "]");

		// Add level
		msg.unshift(this.levelLabels[level] + ":");

		// Add timestamp
		if (this.timestamp) {

			const t = new Date();

			msg.unshift(util.format("%s-%s-%s %s:%s:%s",
				t.getFullYear(),
				("0" + (t.getMonth() + 1)).substr(-2),
				("0" + (t.getDate() + 1)).substr(-2),
				("0" + t.getHours()).substr(-2),
				("0" + t.getMinutes()).substr(-2),
				("0" + t.getSeconds()).substr(-2)
			));

		}

		this.write(level, facility, msg, meta);

	}

	/**
	 * Write formatted log message - should be overriden, not implemented (does nothing)
	 *
	 * @param level Log level
	 * @param facility Facility
	 * @param msg Formated message parts
	 * @param meta Meta-data
	 */
	protected write(level: LOG_LEVEL, facility: string, msg: Array<string>, meta: ILoggerMetaData) {

		return;

	}

	/**
	 * Close all I/O handles - should be overriden, not implemented (does nothing)
	 */
	public close() {

		return;

	}

}
