/*
 * Logger / metaPlatform
 *
 * @author Jiri Hybek <jiri.hybek@cryonix.cz> / Cryonix Innovations <www.cryonix.cz>
 * See LICENSE file distributed with this source code for licensing info
 */

import * as util from "util";
import * as fs from "fs";

let colors = require("colors");

/*
 * Enums
 */
export enum LOG_LEVEL {
	DEBUG = 4,
	INFO = 3,
	WARN = 2,
	BREAK = 1,
	ERROR = 0
}

/*
 * Interfaces
 */
export interface ILogger {
	log(...args);
	break(...args);
	debug(...args);
	info(...args);
	warn(...args);
	error(...args);
}

export interface ILoggerTarget {
	log: (level: LOG_LEVEL, facility: string, args: any) => void;
}

/*
 * Base target
 */
export interface LoggerBaseTargetOptions {
	level?: LOG_LEVEL,
	facilities?: Array<string>;
	timestamp? : boolean;
}

export class LoggerBaseTarget implements ILoggerTarget {

	protected level: LOG_LEVEL = LOG_LEVEL.INFO;
	protected facilities: Array<string> = [];
	protected timestamp: boolean = true;

	protected levelLabels = {};

	public constructor(options: LoggerBaseTargetOptions){

		if(options.level) this.level = options.level;
		if(options.facilities) this.facilities = options.facilities;
		if(options.timestamp !== undefined) this.timestamp = options.timestamp;

		this.levelLabels[LOG_LEVEL.BREAK] = "break";
		this.levelLabels[LOG_LEVEL.DEBUG] = "debug";
		this.levelLabels[LOG_LEVEL.INFO] = "info";
		this.levelLabels[LOG_LEVEL.WARN] = "warn";
		this.levelLabels[LOG_LEVEL.ERROR] = "error";

	}

	public log(level: LOG_LEVEL, facility: string, args: any) {

		if(level > this.level) return;
		if(this.facilities.length > 0 && this.facilities.indexOf(facility) < 0) return;

		let msg = [util.format.apply(this, args)];

		//Add facility
		if(facility)
			msg.unshift("[" + facility + "]");

		//Add level
		msg.unshift(this.levelLabels[level] + ":");

		//Add timestamp
		if(this.timestamp){
			
			let t = new Date();
			
			msg.unshift(util.format("%s-%s-%s %s:%s:%s",
				t.getFullYear(),
				("0" + (t.getMonth() + 1)).substr(-2),
				("0" + (t.getDate() + 1)).substr(-2),
				("0" + t.getHours()).substr(-2),
				("0" + t.getMinutes()).substr(-2),
				("0" + t.getSeconds()).substr(-2)
			));

		}

		this.write(level, facility, msg);

	}

	protected write(level: LOG_LEVEL, facility: string, msg: Array<string>){

		return;

	}

}

/*
 * Console target
 */
export interface LoggerConsoleTargetOptions extends LoggerBaseTargetOptions {
	colorize?: boolean;
}

export class LoggerConsoleTarget extends LoggerBaseTarget {

	protected colorize: boolean = true;
	protected colors: any = {};

	public constructor(options: LoggerConsoleTargetOptions){

		super(options);

		if(options.colorize !== undefined) this.colorize = options.colorize;

		this.colors[LOG_LEVEL.BREAK] = colors.magenta;
		this.colors[LOG_LEVEL.DEBUG] = colors.cyan;
		this.colors[LOG_LEVEL.INFO] = colors.white;
		this.colors[LOG_LEVEL.WARN] = colors.yellow;
		this.colors[LOG_LEVEL.ERROR] = colors.red;

	}

	protected write(level: LOG_LEVEL, facility: string, message: Array<string>){

		if(this.colorize && this.colors[level])
			console.log(this.colors[level](message.join(" ")));
		else
			console.log(message.join(" "));

	}

}

/*
 * File target
 */
export class LoggerFileTarget extends LoggerBaseTarget {

	protected fd;
	protected initialized: boolean = false;

	public constructor(protected filename: string, options: LoggerConsoleTargetOptions){

		super(options);

	}

	protected init(){

		if(this.initialized) return;

		this.fd = fs.openSync(this.filename, "a")
		this.initialized = true;

	}

	protected write(level: LOG_LEVEL, facility: string, message: Array<string>){
		
		this.init();
		fs.write(this.fd, message.join(" ") + "\n", null, "utf-8", () => {});

	}

}

/*
 * JSON target
 */
export class LoggerJSONTarget extends LoggerFileTarget {

	protected init(){

		if(this.initialized) return;

		//Create log file
		if(!fs.existsSync(this.filename))
			fs.writeFileSync(this.filename, "{}", "utf-8");

		super.init();

	}

	public log(level: LOG_LEVEL, facility: string, args: any){

		if(level > this.level) return;
		if(this.facilities.length > 0 && this.facilities.indexOf(facility) < 0) return;

		this.write(level, facility, args);

	}

	protected write(level: LOG_LEVEL, facility: string, message: any){

		this.init();

		fs.write(this.fd, "," + JSON.stringify({
			timestamp: new Date(),
			level: level,
			facility: facility,
			msg: message
		}), null, "utf-8", () => {});

	}

}

/*
 * Logger class
 */
export class Logger implements ILogger {

	protected targets: { [K: string]: ILoggerTarget } = {};

	public _log(level: LOG_LEVEL, facility: string, args: any){

		for(let i in this.targets)
			this.targets[i].log.call(this.targets[i], level, facility, args);

	}

	public log(...args){

		let params = Array.prototype.slice.call(args);
		let level = args.shift();

		this._log(level, null, params);

	}

	public break(...args){

		this._log(LOG_LEVEL.BREAK, null, Array.prototype.slice.call(args));

	}

	public debug(...args){

		this._log(LOG_LEVEL.DEBUG, null, Array.prototype.slice.call(args));

	}

	public info(...args){

		this._log(LOG_LEVEL.INFO, null, Array.prototype.slice.call(args));

	}

	public warn(...args){

		this._log(LOG_LEVEL.WARN, null, Array.prototype.slice.call(args));

	}

	public error(...args){

		this._log(LOG_LEVEL.ERROR, null, Array.prototype.slice.call(args));

	}

	public facility(prefix: string){

		return new Facility(this, prefix);

	}

	public to(id: string, target: ILoggerTarget){

		this.targets[id] = target;
		return this;

	}

	public toConsole(options: LoggerConsoleTargetOptions = {}){

		this.targets["console"] = new LoggerConsoleTarget(options);
		return this;

	}

	public toFile(filename: string, options: LoggerBaseTargetOptions = {}){

		this.targets[filename] = new LoggerFileTarget(filename, options);
		return this;

	}

	public toJsonFile(filename: string, options: LoggerBaseTargetOptions = {}) {

		this.targets[filename] = new LoggerJSONTarget(filename, options);
		return this;

	}

}

/*
 * Facility class
 */
export class Facility implements ILogger {

	public constructor(protected logger: Logger, protected prefix: string) {}
	
	public log(...args){

		let params = Array.prototype.slice.call(args);
		let level = args.shift();

		this.logger._log(level, this.prefix, args);

	}

	public break(...args){

		this.logger._log(LOG_LEVEL.BREAK, this.prefix, Array.prototype.slice.call(args));

	}

	public debug(...args){

		this.logger._log(LOG_LEVEL.DEBUG, this.prefix, Array.prototype.slice.call(args));

	}

	public info(...args){

		this.logger._log(LOG_LEVEL.INFO, this.prefix, Array.prototype.slice.call(args));

	}

	public warn(...args){

		this.logger._log(LOG_LEVEL.WARN, this.prefix, Array.prototype.slice.call(args));

	}

	public error(...args){

		this.logger._log(LOG_LEVEL.ERROR, this.prefix, Array.prototype.slice.call(args));

	}

}

let globalInstance = new Logger();

globalInstance.toConsole({
	level: LOG_LEVEL.INFO,
	colorize: true,
	timestamp: false
});

//Export
export default globalInstance;