# meta2-logger

Simple logging library for NodeJS with support of facilities and multiple transports.

Logger has also first-class support for TypeScript and is fully documented.

**Table of Contents:**
- [Features](#features)
- [Installation](#installation)
- [Usage - TypeScript](#usage-typescript)
- [Usage - vanilla JS](#usage-vanilla-js)
- [Configuring Logging Targets](#configuring-logging-targets)
  - [Console](#console-target)
  - [File](#file-target)
  - [JSON File](#json-file-target)
  - [GrayLog](#graylog-target)
- [Custom Logging Target](#custom-logging-target)
- [Utility Functions](#utility-functions)
  - [parseLogLevel](#parseloglevel)
- [API Reference](#api-reference)
- [Development](#development)
- [License](#license)

## Features

**Built-in transports:**

- Console
- Text file
- JSON file
- GrayLog

**Log levels:**

Library supports all of standard syslog levels.

- debug
- info
- notice
- warn
- error
- critical
- alert
- emergency

**Other features:**

- Facilities
- Meta-data
- Custom targets
- Colorized console output

## Installation

```bash
# Using NPM
npm install meta2-logger

# To save as dependency
npm install --save meta2-logger
```

## Usage (TypeScript)

```typescript
import {Logger, LOG_LEVEL, default as logger} from "meta2-logger";

// Use global logger
logger.info("From global logger");

// Or create new instance
const myLogger = new Logger();

// Setup targets
logger.toConsole({
	level: LOG_LEVEL.INFO,
	timestamp: true,
	colorize: true
}).toFile("demo.log", {
	level: LOG_LEVEL.WARN,
	timestamp: true,
	facilities: [ "test" ]
}).toJsonFile("demo.json", {
	level: LOG_LEVEL.ERROR
}).toGrayLog({
	level: LOG_LEVEL.DEBUG,
	graylogHostname: "localhost"
	host: "myApp"
});

// Log some messages
logger.debug("Hello %s", "debug");
logger.info("Hello %s", "info");
logger.notice("Hello %s", "notice");
logger.warn("Hello %s", "warn"); // or logger.warning("Hello %s", "warn");
logger.error("Hello %s", "error");
logger.crit("Hello %s", "critical");
logger.alert("Hello %s", "alert");
logger.emerg("Hello %s", "emergency"); // or logger.panic("Hello %s", "emergency");

// Create facility
const facility = logger.facility("http");

facility.notice("Server started on port %d", 8080);

// Passing meta-data using object as first argument
facility.warn({ reqId: 123 }, "Bad request");
```

## Usage (vanilla JS)

```javascript
const Logger = require("meta2-logger");

// Accessing global logger instance
const logger = Logger.default;

// Or create new instance
const logger = new Logger.Logger();

// Setup targets
logger.toConsole({
	level: Logger.LOG_LEVEL.INFO,
	timestamp: true,
	colorize: true
}).toFile("demo.log", {
	level: Logger.LOG_LEVEL.WARN,
	timestamp: true,
	facilities: [ "test" ]
}).toJsonFile("demo.json", {
	level: Logger.LOG_LEVEL.ERROR
}).toGrayLog({
	level: Logger.LOG_LEVEL.DEBUG,
	graylogHostname: "localhost"
	host: "myApp"
});

// Log some messages
logger.debug("Hello %s", "debug");
logger.info("Hello %s", "info");
logger.notice("Hello %s", "notice");
logger.warn("Hello %s", "warn"); // or logger.warning("Hello %s", "warn");
logger.error("Hello %s", "error");
logger.crit("Hello %s", "critical");
logger.alert("Hello %s", "alert");
logger.emerg("Hello %s", "emergency"); // or logger.panic("Hello %s", "emergency");

// Create facility
const facility = logger.facility("http");

facility.notice("Server started on port %d", 8080);

// Passing meta-data using object as first argument
facility.warn({ reqId: 123 }, "Bad request");
```

## Configuring Logging Targets

Logging target represents destination transport for log messages.

```typescript
import {default as logger, ConsoleTarget, LOG_LEVEL} from "meta2-logger";

logger.to("uniqueLoggerId", new ConsoleTarget({
	level: Logger.LOG_LEVEL.INFO,
	timestamp: true,
	colorize: true
}));
```

See built-in targets below. Logging target class must implement `ILoggerTarget` interface.

### Console Target

Prints log messages to stdout (console).

```typescript
import {default as logger, ConsoleTarget, LOG_LEVEL} from "meta2-logger";

logger.toConsole({
	// Log level
	level: LOG_LEVEL.DEBUG,

	// Facilities - null to accept all facilities
	facilities: [ "http", "broker", "etc" ],

	// If to print time and date
	timestamp: true,

	// If to print with colors
	colorize: true
});

// Or
logger.to("myConsole", new ConsoleTarget(opts));
```

**Sample output:**

```
2018-01-10 14:24:30 warn: [http] (reqId=123) Bad request
2018-01-10 14:24:30 info: Something happend

eg.:
date time level: [facility] (meta=data) Formatted message
```

**Notice:** Method `toConsole` overrides previous console target settings. Use `logger.to(...)` method to define more targets.

### File Target

Appends log messages to specified file.

Messages are formatted the same way as to the console.

File target can be set for multiple files with different configurations.

```typescript
import {default as logger, FileTarget, LOG_LEVEL} from "meta2-logger";

logger.toFile("filename.log", {
	// Log level
	level: LOG_LEVEL.DEBUG,

	// Facilities - null to accept all facilities
	facilities: [ "http", "broker", "etc" ],

	// If to print time and date
	timestamp: true,
});

// Or
logger.to("myFile", new FileTarget("filename.log", opts));
```

**Sample output:**

```
2018-01-10 14:24:30 warn: [http] (reqId=123) Bad request
2018-01-10 14:24:30 info: Something happend
```

### JSON File Target

Appends log messages to specified JSON file.

File target can be set for multiple files with different configurations.

```typescript
import {default as logger, JsonFileTarget, LOG_LEVEL} from "meta2-logger";

logger.toJsonFile("filename.json", {
	// Log level
	level: LOG_LEVEL.DEBUG,

	// Facilities - null to accept all facilities
	facilities: [ "http", "broker", "etc" ]
});

// Or
logger.to("myJsonFile", new JsonFileTarget("filename.json", opts));
```

**Sample output:**

```
{},
{ timestamp: 1515557050.342, level: 5, facility: "http", msg: "Bad request", meta: { reqId: 123 } },
{ timestamp: 1515557086.342, level: 7, facility: null, msg: "Something happend", meta: {} }
```

**Recommended way to parse JSON log file:**

```javascript
const fs = require("fs");

const logFile = fs.readFileSync("filename.json", { encoding: "utf-8" });
const logMessages = JSON.parse("[" + logFile + "]").slice(1);
```

### GrayLog Target

Sends log messages to GrayLog server using GELF protocol.

```typescript
import {default as logger, GraylogTarget, LOG_LEVEL} from "meta2-logger";

logger.toGrayLog({
	// Log level
	level: LOG_LEVEL.DEBUG,

	// Facilities - null to accept all facilities
	facilities: [ "http", "broker", "etc" ],

	// GrayLog server port
	graylogPort: 12201,

	// GrayLog server hostname
	graylogHostname: "localhost",

	// Connection type, 'lan' or 'wan'
	connection: "lan",

	// Max chunk size for WAN type
	maxChunkSizeWan: 1420,

	// Max chunk size for LAN type
	maxChunkSizeLan: 8154,

	// Host (application) identifier
	host: "_unspecified_",

	// GELF protocol version
	version: "1.0",

	// Facility prefix string - is added before facility name
	facilityPrefix: "",

	// If to log gelf client debug messages to stdout
	debugGelfClient: false,

	// Additional static message fields
	additionalFields: { "myfield": "myValue" }
});

// Or
logger.to("myGrayLogTarget", new GraylogTarget(opts));
```

**Notice:** Message meta-data are added as additional fields.

## Custom Logging Target

To create custom logging target define class which implements `ILoggerTarget` interface. Or extend class `BaseTarget`.

```typescript
import * as util from "util";

import {
	LOG_LEVEL, ILoggerTarget, ILoggerMetaData, BaseTarget, IBaseTargetOptions,
	default as logger
} from "./interfaces";

export interface ISuchTargetOptions extends IBaseTargetOptions {
	soFunny?: boolean;
}

export class SuchTarget extends BaseTarget {

	protected soFunny: boolean:

	public constructor(options: ISuchTargetOptions) {

		super(options);

		this.soFunny = options.soFunny || false;

	}

	/**
	 * Log message
	 *
	 * @param level Log level
	 * @param facility Facility
	 * @param args Message arguments
	 * @param meta Meta-data
	 */
	public log(level: LOG_LEVEL, facility: string, args: any, meta: ILoggerMetaData) {

		// Check such level
		if (level > this.level) return;
		if (this.facilities.length > 0 && this.facilities.indexOf(facility) < 0) return;

		// Format wow message
		const wowMessage = util.format.apply(this, args);

		// Create message parts
		const messageParts = [
			"Wow", Date.now(),
			"such", this.levelLabels[LOG_LEVEL.DEBUG].toUpperCase(),
			"many", facility,
			wowMessage,
			"plz",
			JSON.stringify(meta)
		];

		if(this.soFunny)
			messageParts.push("so funny");

		// Write message
		this.write(level, facility, messageParts, meta);

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

		console.log("So scare", message.join(" "));

	}

}

// Use such target
logger.to("suchTarget", new SuchTarget({
	level: LOG_LEVEL.DEBUG,
	soFunny: true
}));
```

## Utility Functions

### parseLogLevel

This function parses log level from string to number. Is case insensitive.

**Usage:**

```typescript
import {default as logger, parseLogLevel} from "meta2-logger";

logger.toConsole({
	level: parseLogLevel("criTIcal")
});
```


## API Reference

```typescript
class Logger {
	log(level: LOG_LEBEL, ...args): void;
	break(...args): void;
	debug(...args): void;
	info(...args): void;
	notice(...args): void;
	warn(...args): void;
	warning(...args): void;
	error(...args): void;
	crit(...args): void;
	alert(...args): void;
	emerg(...args): void;
	panic(...args): void;
	facility(name: string): LoggerFacility;
	to(id: string, target: ILoggerTarget): Logger;
	getAllTargets(): { [K: string]: ILoggerTarget };
	getTarget(id: string): ILoggerTarget|null;
	toConsole(options: IConsoleTargetOptions = {}): Logger;
	toFile(filename: string, options: IFileTargetOptions = {}): Logger;
	toJsonFile(filename: string, options: IFileTargetOptions = {}): Logger;
	toGrayLog(options: IGraylogTargetOptions): Logger;

	// Close all I/O and socket handles
	close();
}

class LoggerFacility {
	constructor(protected logger: Logger, protected prefix: string);
	break(...args): void;
	debug(...args): void;
	info(...args): void;
	notice(...args): void;
	warn(...args): void;
	warning(...args): void;
	error(...args): void;
	crit(...args): void;
	alert(...args): void;
	emerg(...args): void;
	panic(...args): void;
}

enum LOG_LEVEL {
	DEBUG = 8,
	INFO = 7,
	NOTICE = 6,
	WARN = 5,
	BREAK = 4,
	ERROR = 3,
	CRITICAL = 2,
	ALERT = 1,
	EMERGENCY = 0
}

interface ILogger {
	log(...args);
	break(...args);
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

interface ILoggerMetaData {
	[ K: string ]: string|number|boolean|Date;
	[ K: number ]: string|number|boolean|Date;
}

interface ILoggerTarget {
	log: (level: LOG_LEVEL, facility: string, args: Array<any>, meta: ILoggerMetaData) => void;
	close: () => void;
}

function parseLogLevel(level: string): LOG_LEVEL;
```

## Development

```bash
# Install dependencies
npm install

# Transpile TypeScript
npm run build

# Run linter
npm run lint

# Run tests
npm test
```

## License

This library is published under MIT license.

Copyright (c) 2017 - 2018 Jiri Hybek, jiri@hybek.cz