/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import * as fs from "fs";

import {LOG_LEVEL, ILoggerTarget, ILoggerMetaData} from "./interfaces";
import {FileTarget, IFileTargetOptions} from "./FileTarget";

/**
 * JSON target class
 */
export class JsonFileTarget extends FileTarget {

	/**
	 * Opens file handle to log file
	 */
	protected init() {

		if (this.initialized) return;

		// Create log file
		if (!fs.existsSync(this.filename))
			fs.writeFileSync(this.filename, "{}", "utf-8");

		super.init();

	}

	/**
	 * Log message
	 *
	 * @param level Log level
	 * @param facility Facility
	 * @param args Message arguments
	 * @param meta Meta-data
	 */
	public log(level: LOG_LEVEL, facility: string, args: Array<any>, meta: ILoggerMetaData) {

		if (level > this.level) return;
		if (this.facilities.length > 0 && this.facilities.indexOf(facility) < 0) return;

		this.write(level, facility, args, meta);

	}

	/**
	 * Write log message
	 *
	 * @param level Log level
	 * @param facility Facility
	 * @param msg Message object
	 */
	protected write(level: LOG_LEVEL, facility: string, message: Array<any>, meta: ILoggerMetaData) {

		this.init();

		fs.write(this.fd, "," + JSON.stringify({
			timestamp: Date.now() / 1000,
			level: level,
			facility: facility,
			msg: message,
			meta: meta
		}), null, "utf-8", () => {});

	}

	/**
	 * Close I/O handle
	 */
	public close() {

		if (this.initialized && this.fd)
			fs.closeSync(this.fd);

	}

}
