/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import colors = require("colors");
import {LOG_LEVEL, ILoggerTarget, ILoggerMetaData} from "./interfaces";
import {BaseTarget, IBaseTargetOptions} from "./BaseTarget";

/**
 * Console target options
 */
export interface IConsoleTargetOptions extends IBaseTargetOptions {
	/** If to print colors - works on unix-like systems */
	colorize?: boolean;
}

/**
 * Console target class
 */
export class ConsoleTarget extends BaseTarget {

	protected colorize: boolean = true;
	protected colors: any = {};

	/**
	 * Console target constructor
	 *
	 * Usage:
	 *
	 * ```
	 * logger.to("someUniqueTargetId", new ConsoleTarget({
	 * 	level: LOG_LEVEL.DEBUG,
	 * 	timestamp: true,
	 * 	facilities: [ "server", "broker" ],
	 * 	colorize: true
	 * }));
	 * ```
	 *
	 * @param options Target options
	 */
	public constructor(options: IConsoleTargetOptions) {

		super(options);

		if (options.colorize !== undefined) this.colorize = options.colorize;

		this.colors[LOG_LEVEL.DEBUG] = colors.cyan;
		this.colors[LOG_LEVEL.INFO] = colors.gray;
		this.colors[LOG_LEVEL.NOTICE] = colors.white;
		this.colors[LOG_LEVEL.WARN] = colors.yellow;
		this.colors[LOG_LEVEL.ERROR] = colors.red;
		this.colors[LOG_LEVEL.CRITICAL] = colors.red;
		this.colors[LOG_LEVEL.ALERT] = colors.red;
		this.colors[LOG_LEVEL.EMERGENCY] = colors.magenta;

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

		if (this.colorize && this.colors[level])
			console.log(this.colors[level](message.join(" ")));
		else
			console.log(message.join(" "));

	}

}
