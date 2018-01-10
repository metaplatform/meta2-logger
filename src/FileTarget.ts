/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import * as fs from "fs";

import {LOG_LEVEL, ILoggerTarget, ILoggerMetaData} from "./interfaces";
import {BaseTarget, IBaseTargetOptions} from "./BaseTarget";

/**
 * File target options
 */
export interface IFileTargetOptions extends IBaseTargetOptions {}

/**
 * File target class
 */
export class FileTarget extends BaseTarget {

	protected fd;
	protected initialized: boolean = false;

	/**
	 * File target constructor
	 *
	 * Usage:
	 *
	 * ```
	 * logger.to("someUniqueTargetId", new FileTarget("myLogFile.log", {
	 * 	level: LOG_LEVEL.DEBUG,
	 * 	timestamp: true,
	 * 	facilities: [ "server", "broker" ],
	 * }));
	 * ```
	 *
	 * @param filename Log filename
	 * @param options Target options
	 */
	public constructor(protected filename: string, options: IFileTargetOptions) {

		super(options);

	}

	/**
	 * Opens file handle to log file
	 */
	protected init() {

		if (this.initialized) return;

		this.fd = fs.openSync(this.filename, "a");
		this.initialized = true;

	}

	/**
	 * Write formatted log message
	 *
	 * @param level Log level
	 * @param facility Facility
	 * @param msg Formated message parts
	 * @param meta Meta-data
	 */
	protected write(level: LOG_LEVEL, facility: string, message: Array<string>, meta: ILoggerMetaData) {

		this.init();
		fs.write(this.fd, message.join(" ") + "\n", null, "utf-8", () => {});

	}

	/**
	 * Close I/O handle
	 */
	public close() {

		if (this.initialized && this.fd)
			fs.closeSync(this.fd);

	}

}
