"use strict";
exports.__esModule = true;
var atem_connection_1 = require("atem-connection");
var ws281x = require("rpi-ws281x");
var tallyNumber = 1;
var Led = /** @class */ (function () {
    function Led() {
        this.config = {
            leds: 32,
            dma: 10,
            brightness: 42,
            gpio: 18,
            type: "grb"
        };
        // Configure ws281x
        ws281x.configure(this.config);
    }
    Led.prototype.red = function () {
        // Create a pixel array matching the number of leds.
        // This must be an instance of Uint32Array.
        var pixels = new Uint32Array(this.config.leds);
        // Create a fill color with red/green/blue.
        var red = 0, green = 255, blue = 0;
        var color = (red << 16) | (green << 8) | blue;
        for (var i = 0; i < this.config.leds; i++)
            pixels[i] = color;
        // Render to strip
        ws281x.render(pixels);
    };
    Led.prototype.green = function () {
        // Create a pixel array matching the number of leds.
        // This must be an instance of Uint32Array.
        var pixels = new Uint32Array(this.config.leds);
        // Create a fill color with red/green/blue.
        var red = 255, green = 0, blue = 0;
        var color = (red << 16) | (green << 8) | blue;
        for (var i = 0; i < this.config.leds; i++)
            pixels[i] = color;
        // Render to strip
        ws281x.render(pixels);
    };
    Led.prototype.off = function () {
        // Create a pixel array matching the number of leds.
        // This must be an instance of Uint32Array.
        var pixels = new Uint32Array(this.config.leds);
        // Create a fill color with red/green/blue.
        var red = 0, green = 0, blue = 0;
        var color = (red << 16) | (green << 8) | blue;
        for (var i = 0; i < this.config.leds; i++)
            pixels[i] = color;
        // Render to strip
        ws281x.render(pixels);
    };
    return Led;
}());
var Main = /** @class */ (function () {
    function Main(ip) {
        var _this = this;
        this.ip = ip;
        this.switcher = new atem_connection_1.Atem();
        this.led = new Led();
        this.switcher.on("connected", function () {
            console.log("Connected to " + _this.ip + ".");
            _this.parseNewState();
            _this.switcher.on("stateChanged", function (state) {
                _this.parseNewState();
            });
        });
        this.switcher.on("disconnected", function () {
            console.log("Disconnected from " + _this.ip + ".");
            _this.connect();
        });
    }
    Main.prototype.parseNewState = function () {
        // checking out current preview and program information
        var new_preview = this.switcher.listVisibleInputs("preview", 0);
        var new_program = this.switcher.listVisibleInputs("program", 0);
        var skip = true;
        console.log("PREVIEW: " + new_preview);
        if (new_preview.includes(tallyNumber)) {
            console.log("WE ARE PREVIEW");
            this.led.green();
            skip = false;
        }
        this.preview = new_preview;
        console.log("PROGRAM: " + new_program);
        if (new_program.includes(tallyNumber)) {
            console.log("WE ARE PROGRAM");
            this.led.red();
            skip = false;
        }
        this.program = new_program;
        if (skip) {
            this.led.off();
        }
    };
    Main.prototype.connect = function () {
        console.log("Connecting to " + this.ip + "...");
        this.switcher.connect(this.ip);
    };
    return Main;
}());
var atem = new Main("192.168.178.140");
atem.connect();
