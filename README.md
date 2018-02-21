# meta2-logger

Simple logging library for NodeJS with support of facilities and multiple transports.

Logger has also first-class support for TypeScript and is fully documented.

**Table of Contents:**
- [Features](#features)
- [Installation](#installation)
- [Usage - TypeScript](#usage-typescript)
- [Usage - vanilla JS](#usage-vanilla-js)
- [Facilities](#facilities)
- [Setting log level](#setting-log-level)
- [Configuring Logging Targets](#configuring-logging-targets)
  - [Console](#console-target)
  - [File](#file-target)
  - [JSON File](#json-file-target)
  - [Memory](#memory-target)
  - [GrayLog](#graylog-target)
- [Custom Logging Target](#custom-logging-target)
- [Utility Functions](#utility-functions)
  - [parseLogLevel](#parseloglevel)
  - [@Logging decorator](#logging-decorator)
  - [@LogMethodCall decorator](#logmethodcall-decorator)
- [Logging Stack Trace](#logging-stack-trace-experimental)
- [API Reference](#api-reference)
- [Development](#development)
- [License](#license)

## Features

**Built-in transports:**

- Console
- Text file
- JSON file
- Memory
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
- TypeScript decorators to simply enable logging on classes and methods
- Remote management server with UI and REST API provided by [`meta2-logger-server`](https://github.com/metaplatform/meta2-logger-server.git) package

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
const myLogger = new Logger({
	level: LOG_LEVEL.DEBUG
});

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
const facility = logger.facility("http", {
	level: LOG_LEVEL.INFO
});

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

## Facilities

Logging facility provides a way to decouple logging based on their purpose.

**Creating facility from logger:**

```typescript
import {default as logger, LOG_LEVEL} from "meta2-logger";

// Create facility from main logger - options are optional
const facility = logger.facility("facilityName", {
	level: LOG_LEVEL.INFO
});

// We can change facility log level later
facility.setLevel(LOG_LEVEL.NOTICE);
facility.getLevel(); // -> LOG_LEVEL.NOTICE

// Log to facility
facility.info("Message");

// We can get existing facility instance by calling facility method again
const facilityAgain = logger.facility("facilityName");

// We can get map of all registered facilities
logger.getAllFacilities(); // -> { facilityName: LoggerFacility }
```

**Creating facility manually:**

```typescript
import {default as logger, LOG_LEVEL, LoggerFacility} from "meta2-logger";

// Create facility and pass logger as first argument, options are optional
const facility = new LoggerFacility(logger, "facilityName", {
	level: LOG_LEVEL.INFO
});

// Log to facility
facility.info("Message");
```

## Setting log level

Log levels can be set on logger, facility and on targets.

Classes `Logger`, `LoggerFacility` and logging targets support `setLevel` and `getLevel` methods.

**Example:**

```typescript
import {default as logger, LOG_LEVEL} from "meta2-logger";

logger.setLevel(LOG_LEVEL.INFO);

logger.debug("Message"); //Does not log
logger.warn("Message"); //Does log

logger.getLevel(); //Returns LOG_LEVEL.INFO;

// Changing log level on target(s)
logger.toConsole({
	level: LOG_LEVEL.NOTICE
});

logger.getTarget("__console__").setLevel(LOG_LEVEL.DEBUG);
logger.getTarget("__console__").getLevel(); // -> LOG_LEVEL.DEBUG

// Also works on LoggerFacility
const facility = logger.facility("http");

facility.setLevel(LOG_LEVEL.WARN);
facility.getLevel(); // -> LOG_LEVEL.WARN

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

### Memory Target

Stores log messages in memory.

```typescript
import {default as logger, MemoryTarget, LOG_LEVEL} from "meta2-logger";

logger.toMemory({
	// Log level
	level: LOG_LEVEL.DEBUG,

	// Facilities - null to accept all facilities
	facilities: [ "http", "broker", "etc" ],

	// How many messages to store, default 1000
	limit: 1000
});

// Get messages
logger.getTarget("__memory__").getMessages();

// Or
const memTarget = new MemoryTarget(opts);

logger.to("myMemory", memTarget);

memTarget.getMessages();
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

### @Logging decorator

Decorator to configure and assign `LoggerFacility` instance to a class.

**Note: decorators are experimental TypeScript feature.**

**Usage:**

```typescript
import {Logger, Logging, LoggerFacility, LOG_LEVEL} from "meta2-logger";

const myLogger = new Logger();

// Second argument can be omitted
@Logging("facilityName", {
	logger: myLogger, // When omitted default logger will be used
	level: LOG_LEVEL.DEBUG
})
class MyClass {

	public log: LoggerFacility;

	public doSomething(){

		this.log.info("Hello");

	}

}

const obj = new MyClass();
obj.doSomething(); // -> will log debug: [facilityName] Hello
```

### @LogMethodCall decorator

Decorator to log every method call. When `@Logging` decorator is applied it's configuration will be used.

**Note: decorators are experimental TypeScript feature.**

**Usage:**

```typescript
import {Logger, Logging, LogMethodCall, LoggerFacility, LOG_LEVEL} from "meta2-logger";

const myLogger = new Logger();

// Second argument can be omitted
@Logging("facilityName", {
	logger: myLogger, // When omitted default logger will be used
	level: LOG_LEVEL.DEBUG
})
class MyClass {

	public log: LoggerFacility;

	/*
	 * Decorator arguments (all are optional):
	 * - LOG_LEVEL
	 * - If to capture arguments
	 * - Message prefix
	 */
	@LogMethodCall(LOG_LEVEL.DEBUG, true, "Hey")
	public doSomething(...args){
		return true;
	}

}

const obj = new MyClass();
obj.doSomething("hello", "world");
```

will log:

```plain
debug: [facilityName] (method=doSomething) (class=MyClass) Hey Method MyClass.doSomething called with arguments [ 'hello', 'world' ]
	at class_1.descriptor.value [as doSomething] (/path/to/app/node_modules/meta2-logger/dist/src/util.ts:90:38)
    at Logger.info (/path/to/app/node_modules/meta2-logger/dist/src/Logger.js:286:14)
    at Object.<anonymous> (/path/to/app/index.js:30:24)
    at Module._compile (module.js:571:32)
    at Object.Module._extensions..js (module.js:580:10)
    at Module.load (module.js:488:32)
    at tryModuleLoad (module.js:447:12)
    at Function.Module._load (module.js:439:3)
    at Module.runMain (module.js:605:10)
```

## Logging Stack Trace (experimental)

Logger has built-in feature to capture stack trace for every log message. If enabled call stack will be available as `trace` meta value. Note that internal logger function calls are excluded.

**Warning: Capturing of stack traces has a significant impact on performance and should be used only for temporary debugging.**

This feature is currently experimental.

Also, note that this feature does not affect possibility to log stack trace by passing an error object as an argument to a log method - eg `... catch(err){ logger.error("Operation failed:", err); }` will work always.

**Following example:**
```typescript
import {default as logger} from "meta2-logger";

logger.enableTrace();
logger.toConsole();

logger.info("Hello!");

// To turn it off
logger.enableTrace(false);
```

will print to console:

```plain
info: hello
  >>
    at Logger.info (/path/to/app/node_modules/meta2-logger/dist/src/Logger.js:286:14)
    at Object.<anonymous> (/path/to/app/index.js:30:24)
    at Module._compile (module.js:571:32)
    at Object.Module._extensions..js (module.js:580:10)
    at Module.load (module.js:488:32)
    at tryModuleLoad (module.js:447:12)
    at Function.Module._load (module.js:439:3)
    at Module.runMain (module.js:605:10)
```

## API Reference

```typescript
class Logger {
	getLevel(): LOG_LEVEL;
	setLevel(level: LOG_LEVEL);
	log(level: LOG_LEBEL, ...args): void;
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
	getAllFacilities(): { [K: string]: LoggerFacility };
	to(id: string, target: ILoggerTarget): Logger;
	getAllTargets(): { [K: string]: ILoggerTarget };
	getTarget(id: string): ILoggerTarget|null;
	toConsole(options: IConsoleTargetOptions = {}): Logger;
	toFile(filename: string, options: IFileTargetOptions = {}): Logger;
	toJsonFile(filename: string, options: IFileTargetOptions = {}): Logger;
	toGrayLog(options: IGraylogTargetOptions): Logger;
	enableTrace(enabled: boolean);
	isTraceEnabled(): boolean;

	// Close all I/O and socket handles
	close();
}

class LoggerFacility {
	constructor(protected logger: Logger, protected prefix: string);
	getLevel(): LOG_LEVEL;
	setLevel(level: LOG_LEVEL);
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
	DEBUG = 7,
	INFO = 6,
	NOTICE = 5,
	WARN = 4,
	ERROR = 3,
	CRITICAL = 2,
	ALERT = 1,
	EMERGENCY = 0
}

interface ILogger {
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
	getLevel(): LOG_LEVEL;
	setLevel(level: LOG_LEVEL);
}

interface ILoggerMetaData {
	[ K: string ]: string|number|boolean|Date;
	[ K: number ]: string|number|boolean|Date;
}

interface ILoggerTarget {
	log: (level: LOG_LEVEL, facility: string, args: Array<any>, meta: ILoggerMetaData) => void;
	close: () => void;
	getLevel(): LOG_LEVEL;
	setLevel(level: LOG_LEVEL);
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