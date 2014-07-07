var fs = require("fs");
var util = require("util");
var bunyan = require("bunyan");
var slice = Array.prototype.slice;

function ensureDirectory(logPath) {
    var dirExists = fs.existsSync(logPath);
    if (!dirExists) {
        fs.mkdirSync(logPath);
    }
}

function postalize(channel, logger, options, host) {
    var subs = options.types.map(function(logType) {
        channel.subscribe(logType, function(data) {
            logger[logType](data);
            if(host && host.notifyClients && options.notifyClients) {
                host.notifyClients(logType, data);
            }
        });
    });
    return subs;
}

function createLogger(logPath, name, options) {
    return bunyan.createLogger({
        name: name,
        streams: options.types.map(function(type){
            return {
                level : type,
                path: logPath + "/" + name + "-" + type + ".log"
            };
        })
    });
}

function logIt(channel, type, data) {
    var msg = (typeof data[0] === "string") ? util.format.apply(null, data) : data;
    channel.publish(type, { msg: msg, timestamp: Date.now() });
}

module.exports = function(host, postal, options) {
    options = options || {};
    options.types = ["info", "debug", "warn", "error"];

    if(!options.loggerName && !options.channelName) {
        throw new Error("You need to at least specify a channelName.");
    }

    if(!options.channelName) {
        console.warn("You've not specified a channel name for the log messages in postal.\nAre you SURE you want all your log messages on the default channel?!");
    }

    var logPath = options.logPath || "./log";
    var name = options.loggerName || (host && host.appName || options.channelName);
    var logChannel = postal.channel(options.channelName);

    ensureDirectory(logPath);
    var logger = createLogger(logPath, name, options);
    var subs = postalize(logChannel, logger, options, host);
    
    return {
        __lumberjack: {
            logger: logger,
            channel: logChannel,
            subscriptions: subs
        },
        info: function() {
            logIt(logChannel, "info", slice.call(arguments, 0));
        },
        debug: function() {
            logIt(logChannel, "debug", slice.call(arguments, 0));
        },
        error: function() {
            logIt(logChannel, "error", slice.call(arguments, 0));
        },
        warn: function() {
            logIt(logChannel, "warn", slice.call(arguments, 0));
        }
    };
};