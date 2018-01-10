/*
 * meta2-logger
 *
 * @author Jiri Hybek <jiri@hybek.cz> (https://jiri.hybek.cz/)
 * @copyright 2017 - 2018 Jiří Hýbek
 * @license MIT
 */

import * as util from "util";
import Gelf = require("gelf");

import {LOG_LEVEL, ILoggerTarget, ILoggerMetaData} from "./interfaces";
import {BaseTarget, IBaseTargetOptions} from "./BaseTarget";
import { setTimeout } from "timers";

/**
 * GreyLog (GELF) target options
 */
export interface IGraylogTargetOptions extends IBaseTargetOptions {
	/** GrayLog server port, default 12201 */
	graylogPort?: number;

	/** GrayLog server hostname */
	graylogHostname: string;

	/** Connection type: 'lan' or 'wan', default 'lan' */
	connection?: string;

	/** Max chunk size for WAN type, default 1420 */
	maxChunkSizeWan?: number;

	/** Max chunk size for LAN type, default 8154 */
	maxChunkSizeLan?: number;

	/** Host (application) identifier, default '_unspecified_' */
	host?: string;

	/** GELF protocol version, default '1.0' */
	version?: string;

	/** Facility prefix string */
	facilityPrefix?: string;

	/** If to log debug messages to stdout */
	debugGelfClient?: boolean;

	/** Additional static message fields */
	additionalFields?: { [K: string]: string|number };
}

/**
 * GrayLog (GELF) target class
 */
export class GraylogTarget extends BaseTarget {

	protected version: string;
	protected host: string;
	protected facilityPrefix: string;
	protected additionalFields: { [K: string]: string|number };

	protected debug: boolean;

	public readonly logLevelMap: { [K: number]: number } = {};

	/** Gelf instance */
	protected gelf: Gelf;

	/**
	 * GrayLog target constructor
	 *
	 * Usage:
	 *
	 * ```
	 * logger.to("someUniqueTargetId", new GraylogTarget({
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
	 * }));
	 * ```
	 *
	 * @param options Target options
	 */
	public constructor(options: IGraylogTargetOptions) {

		super(options);

		// Define log level mapping
		this.logLevelMap[LOG_LEVEL.DEBUG] = 7;
		this.logLevelMap[LOG_LEVEL.INFO] = 6;
		this.logLevelMap[LOG_LEVEL.NOTICE] = 5;
		this.logLevelMap[LOG_LEVEL.WARN] = 4;
		this.logLevelMap[LOG_LEVEL.ERROR] = 3;
		this.logLevelMap[LOG_LEVEL.CRITICAL] = 2;
		this.logLevelMap[LOG_LEVEL.ALERT] = 1;
		this.logLevelMap[LOG_LEVEL.EMERGENCY] = 0;

		// Assign config
		this.version = options.version || "1.0";
		this.host = options.host || "_unspecified_";
		this.facilityPrefix = options.facilityPrefix || "";
		this.additionalFields = options.additionalFields || {};

		this.debug = options.debugGelfClient || false;

		const connOpts = {
			graylogPort: options.graylogPort || 12201,
			graylogHostname: options.graylogHostname,
			connection: options.connection || "lan",
			maxChunkSizeWan: options.maxChunkSizeWan || 1420,
			maxChunkSizeLan: options.maxChunkSizeLan || 8154
		};

		if (this.debug)
			console.log("GrayLog connection opts:", connOpts);

		this.gelf = new Gelf(connOpts);

		this.gelf.on("error", (err) => {

			if (this.debug)
				console.error("Failed to sent GrayLog message:", err);

		});

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

		const msgFull = util.format.apply(this, args);
		const msgShort = msgFull.split("\n").shift();

		const logLevel = this.logLevelMap[level] || 3;

		const payload = {
			version: this.version,
			host: this.host,
			short_message: msgShort,
			full_message: msgFull,
			timestamp: Date.now() / 1000,
			level: logLevel
		};

		for (const i in this.additionalFields)
			payload["_" + i] = this.additionalFields[i];

		for (const i in meta)
			payload["_" + i] = String(meta[i]);

		if (facility)
			payload["_facility"] = this.facilityPrefix + facility;

		if (this.debug)
			console.log("GrayLog message:", payload);

		this.send(payload);

	}

	/**
	 * Send message to GrayLog server
	 *
	 * @param level Log level
	 * @param facility Facility
	 * @param msg Formated message parts
	 */
	protected send(payload) {

		this.gelf.emit("gelf.log", payload);

	}

	/**
	 * Close socket handle
	 */
	public close() {

		// Close directly
		if (this.gelf.client._bindState === 2) {

			this.gelf.closeSocket();

		// Wait for socket to init
		} else {

			setTimeout(() => {

				this.gelf.closeSocket();

			}, 1000);

		}

	}

}
