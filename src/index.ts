/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import {LOG_LEVEL} from "./interfaces";
import {Logger} from "./Logger";

export * from "./interfaces";
export * from "./util";
export * from "./Logger";
export * from "./LoggerFacility";
export * from "./BaseTarget";
export * from "./ConsoleTarget";
export * from "./MemoryTarget";
export * from "./FileTarget";
export * from "./JsonFileTarget";
export * from "./GraylogTarget";

const globalInstance = new Logger();

globalInstance.toConsole({
	level: LOG_LEVEL.INFO,
	colorize: true,
	timestamp: false
});

// Export
export default globalInstance;
