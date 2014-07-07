##postal.bunyan

###What is it?
It adapts [postal](https://github.com/postaljs/postal.js) and [bunyan](https://github.com/trentm/node-bunyan) together (and optionally [autohost](https://github.com/LeanKit-Labs/autohost)), so that messages published to your selected "logging" channel in postal will be written to file(s) via bunyan, and also sent down to autohost clients (if you enable the option).

###How do I use it?

```javascript

	var postal = require("postal");
	var host = require("autohost")({
	    appName: "yourAppName"
	});
	var logger = require("postal.lumberjack")(host, postal, {
			loggerName: "loggerName",        // OPTIONAL. defaults to use host.appName
			channelName: "postalLogChannel"  // The channel name for your postal log channel
			logPath: "./log"                 // Path to where you want your log files written. Defaults to ./log
			notifyClients : false            // Bool flag that, if set to true, will push log messages to authost clients
		});

	// You can log straight up string messages if you like
	logger.info("Here's some helpful info");

	// But it also supports console.log style interpolation
	logger.debug("%s debug messages are %s", verbose, verbose);

	logger.warn("OH SNAP, I might need to slap you...");

	// And of course, you can log JSON
	logger.error({ foo: "bar" });

```