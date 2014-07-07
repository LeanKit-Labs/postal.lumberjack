/*global describe,it,before,beforeEach,after */
var should = require("should"); //jshint ignore: line
var postal = require("postal");
var fs = require("fs-extra");
var path = require("path");
var slice = Array.prototype.slice;

var hostStub = {
	results: [],
	notifyClients: function() {
		this.results.push(slice.call(arguments, 0));
	}
};

describe("postal.lumberjack specs", function() {
	var lumberjack;

	after(function(done){
		var dir = path.resolve("./log");
		fs.remove(dir, done);
	});

	describe("when using default logging types", function(){
		var logChannel = "log";
		var results = [];
		postal.subscribe({
			channel: logChannel,
			topic: "#",
			callback: function(d, e) {
				results.push(e);
			}
		});
		
		beforeEach(function(){
			results = [];
			hostStub.results = [];
		});

		describe("And not notifying host clients", function() {
			before(function(){
				lumberjack = new require("../src/index.js")(hostStub, postal, {
					channelName: logChannel,
					notifyClients: false
				});
			});
			it("should log an info message", function() {
				var expectedMsg = "Test info data";
				lumberjack.info(expectedMsg);
				results[0].data.msg.should.equal(expectedMsg);
				hostStub.results.length.should.equal(0);
			});
			it("should log a debug message", function() {
				var expectedMsg = "Test debug data";
				lumberjack.debug(expectedMsg);
				results[0].data.msg.should.equal(expectedMsg);
				hostStub.results.length.should.equal(0);
			});
			it("should log an error message", function() {
				var expectedMsg = "Test error data";
				lumberjack.error(expectedMsg);
				results[0].data.msg.should.equal(expectedMsg);
				hostStub.results.length.should.equal(0);
			});
			it("should log a warn message", function() {
				var expectedMsg = "Test warn data";
				lumberjack.warn(expectedMsg);
				results[0].data.msg.should.equal(expectedMsg);
				hostStub.results.length.should.equal(0);
			});
		});

	});
});
