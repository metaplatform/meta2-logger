/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

/**
 * Log levels
 */
export enum LOG_LEVEL {
	DEBUG = 7,
	INFO = 6,
	NOTICE = 5,
	WARN = 4,
	ERROR = 3,
	CRITICAL = 2,
	ALERT = 1,
	EMERGENCY = 0
}

/**
 * Logger interface
 */
export interface ILogger {
	log(...args);
	debug(...args);
	info(...args);
	notice(...args);
	warn(...args);
	warning(...args);
	error(...args);
	crit(...args);
	alert(...args);
	emerg(...args);
	panic(...args);
}

export interface ILoggerMetaData {
	[ K: string ]: string|number|boolean|Date;
	[ K: number ]: string|number|boolean|Date;
}

/**
 * Logger target interface
 */
export interface ILoggerTarget {
	log: (level: LOG_LEVEL, facility: string, args: Array<any>, meta: ILoggerMetaData) => void;
	close: () => void;
}
