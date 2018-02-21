/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import {LOG_LEVEL_NAME_MAP} from "./interfaces";
import { Logger, ILoggerFacilityConfig, ILogger, default as _defaultLogger, LOG_LEVEL, LoggerFacility } from "./index";

/**
 * Parse log level from string to LOG_LEVEL enum value
 *
 * @param level Log level
 */
export function parseLogLevel(level: string) {

	const _level = LOG_LEVEL_NAME_MAP[level.toLocaleLowerCase()];

	if (_level !== undefined)
		return _level;
	else
		throw new Error("Unknown log level '" + level + "'");

}

/**
 * Logging decorator options
 */
export interface ILoggingDecoratorOptions extends ILoggerFacilityConfig {
	logger?: Logger;
}

/**
 * Logging decorator
 *
 * Assigns logger facility as `log` property.
 * Note: experimentalDecorators must be enabled
 *
 * @param constructor Class
 * @param facility Facility name
 * @param opts Facility options
 */
export function Logging<T extends {new(...args: any[])}>(
	facility?: string,
	opts: ILoggingDecoratorOptions = {}
) {

	return (target: T) => {

		return class extends target {

			public log: ILogger;

			public constructor(...args) {

				super(...args);

				const _facility = ( facility || target.constructor ? target.constructor["name"] : "Class" );

				this.log = ( opts.logger ? opts.logger : _defaultLogger ).facility(_facility, opts);

			}

		};

	};

}

/**
 * Log method call decorator
 *
 * Traces method call
 *
 * @param level Log level
 * @param captureArgs If to capture arguments
 * @param prefix Log message prefix
 */
export function LogMethodCall(
	level: LOG_LEVEL = LOG_LEVEL.DEBUG,
	captureArgs: boolean = true,
	prefix: string = "") {

	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {

		const _fn = descriptor.value;

		descriptor.value = function(...args) {

			const stackTrace = _defaultLogger.captureStackTrace("");

			const meta = {
				class: target.constructor.name,
				method: propertyKey
			};

			const logger = this.log && this.log instanceof LoggerFacility ? this.log : _defaultLogger;
			const logArgs: Array<any> = [level, meta, prefix, "Method " + meta.class + "." + propertyKey + " called"];

			if (captureArgs) {
				logArgs.push("with arguments");
				logArgs.push(args);
			}

			logArgs.push("\n" + stackTrace);

			logger.log.apply(logger, logArgs);

			return _fn.apply(target, args);

		};

		return descriptor;

	};

}
