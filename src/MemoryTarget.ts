/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import * as util from "util";
import {EventEmitter} from "events";

import {LOG_LEVEL, ILoggerTarget, ILoggerMetaData} from "./interfaces";
import {BaseTarget, IBaseTargetOptions} from "./BaseTarget";

/**
 * Memory target configuration options
 */
export interface IMemoryTargetOptions extends IBaseTargetOptions {
	limit?: number;
}

/**
 * Stored message interface
 */
export interface IMemoryTargetMessage {
	timestamp: number;
	level: LOG_LEVEL;
	facility: string;
	meta: ILoggerMetaData;
	message: string;
}

/**
 * Memory target class
 */
export class MemoryTarget extends BaseTarget {

	/** Message limit */
	protected limit: number;

	/** Stored messages */
	protected messages: Array<IMemoryTargetMessage> = [];

	/** Event emitter instance */
	public readonly emitter: EventEmitter;

	/**
	 * Memory logger target constructor
	 *
	 * Usage:
	 *
	 * ```
	 * logger.to("someUniqueTargetId", new MemoryTarget({
	 * 	level: LOG_LEVEL.DEBUG,
	 * 	facilities: [ "server", "broker" ],
	 *  limit: 1000
	 * }));
	 * ```
	 *
	 * @param options Target options
	 */
	public constructor(options: IMemoryTargetOptions) {

		super(options);

		this.limit = options.limit || 1000;

		this.emitter = new EventEmitter();

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

		const message: IMemoryTargetMessage = {
			timestamp: Date.now() / 1000,
			level: level,
			facility: facility,
			meta: meta,
			message: util.format.apply(this, args)
		};

		this.messages.push(message);

		if (this.messages.length > this.limit)
			this.messages.shift();

		this.emitter.emit("message", message);

	}

	/**
	 * Return stored messages
	 */
	public getMessages() {

		return this.messages;

	}

	/**
	 * Remove all stored messages
	 */
	public clearMessages() {

		this.messages = [];

	}

}
