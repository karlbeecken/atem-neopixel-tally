import { Atem as AtemSwitcher } from "atem-connection";
const ws281x = require("rpi-ws281x");

const tallyNumber: number = 1;
class Led {
  config: {
    leds: number;
    dma: number;
    brightness: number;
    gpio: number;
    type: string;
  };

  constructor() {
    this.config = {
      leds: 32,
      dma: 10,
      brightness: 42,
      gpio: 18,
      type: "grb",
    };
    // Configure ws281x
    ws281x.configure(this.config);
  }

  red() {
    // Create a pixel array matching the number of leds.
    // This must be an instance of Uint32Array.
    var pixels = new Uint32Array(this.config.leds);

    // Create a fill color with red/green/blue.
    var red = 0,
      green = 255,
      blue = 0;
    var color = (red << 16) | (green << 8) | blue;

    for (var i = 0; i < this.config.leds; i++) pixels[i] = color;

    // Render to strip
    ws281x.render(pixels);
  }

  green() {
    // Create a pixel array matching the number of leds.
    // This must be an instance of Uint32Array.
    var pixels = new Uint32Array(this.config.leds);

    // Create a fill color with red/green/blue.
    var red = 255,
      green = 0,
      blue = 0;
    var color = (red << 16) | (green << 8) | blue;

    for (var i = 0; i < this.config.leds; i++) pixels[i] = color;

    // Render to strip
    ws281x.render(pixels);
  }

  off() {
    // Create a pixel array matching the number of leds.
    // This must be an instance of Uint32Array.
    var pixels = new Uint32Array(this.config.leds);

    // Create a fill color with red/green/blue.
    var red = 0,
      green = 0,
      blue = 0;
    var color = (red << 16) | (green << 8) | blue;

    for (var i = 0; i < this.config.leds; i++) pixels[i] = color;

    // Render to strip
    ws281x.render(pixels);
  }
}
class Main {
  switcher: AtemSwitcher;
  ip: string;
  preview: any;
  program: any;
  led: Led;
  timeout: boolean;

  constructor(ip: string) {
    this.ip = ip;
    this.switcher = new AtemSwitcher();
    this.led = new Led();

    this.switcher.on("connected", () => {
      console.log(`Connected to ${this.ip}.`);

      this.parseNewState();

      this.switcher.on("stateChanged", (state: any) => {
        this.parseNewState();
      });
    });

    this.switcher.on("disconnected", () => {
      console.log(`Disconnected from ${this.ip}.`);
      this.connect();
    });
  }

  parseNewState() {
    if (this.timeout) return;
    // checking out current preview and program information
    let new_preview = this.switcher.listVisibleInputs("preview", 0);
    let new_program = this.switcher.listVisibleInputs("program", 0);
    let skip = true;

    console.log(`PREVIEW: ${new_preview}`);
    console.log(`PROGRAM: ${new_program}`);

    if (new_program.includes(tallyNumber)) {
      console.log("WE ARE PROGRAM");
      this.led.red();
      skip = false;
    } else if (new_preview.includes(tallyNumber)) {
      console.log("WE ARE PREVIEW");
      this.led.green();
      skip = false;
    } else this.led.off();

    this.preview = new_preview;
    this.program = new_program;

    this.timeout = true;
    setTimeout(() => {
      this.timeout = false;
    }, 100);
  }

  connect() {
    console.log(`Connecting to ${this.ip}...`);
    this.switcher.connect(this.ip);
  }
}

let atem = new Main("192.168.178.140");
atem.connect();
