"use strict";
exports.__esModule = true;
var atem_connection_1 = require("atem-connection");
var Main = /** @class */ (function () {
    function Main(ip) {
        var _this = this;
        this.ip = ip;
        this.switcher = new atem_connection_1.Atem();
        this.switcher.on('connected', function () {
            console.log("Connected to " + _this.ip + ".");
            _this.parseNewState();
            _this.switcher.on('stateChanged', function (state) {
                _this.parseNewState();
            });
        });
        this.switcher.on('disconnected', function () {
            console.log("Disconnected from " + _this.ip + ".");
            _this.connect();
        });
    }
    Main.prototype.parseNewState = function () {
        // checking out current preview and program information
        var new_preview = this.switcher.listVisibleInputs("preview", 0);
        var new_program = this.switcher.listVisibleInputs("program", 0);
        console.log("PREVIEW: " + new_preview);
        this.preview = new_preview;
        console.log("PROGRAM: " + new_program);
        this.program = new_program;
    };
    Main.prototype.connect = function () {
        console.log("Connecting to " + this.ip + "...");
        this.switcher.connect(this.ip);
    };
    return Main;
}());
var atem = new Main("192.168.178.140");
atem.connect();