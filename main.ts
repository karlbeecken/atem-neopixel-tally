import { Atem as AtemSwitcher } from 'atem-connection';

class Main {

  switcher: AtemSwitcher;
  ip: string;
  preview: any;
  program: any;

  constructor(ip: string) {
    this.ip = ip
    this.switcher = new AtemSwitcher()

    this.switcher.on('connected', () => {
      console.log(`Connected to ${this.ip}.`);

      this.parseNewState()

      this.switcher.on('stateChanged', (state: any) => {
        this.parseNewState()
      });

    })

    this.switcher.on('disconnected', () => {
      console.log(`Disconnected from ${this.ip}.`);
      this.connect();
    })

  }

  parseNewState() {

    // checking out current preview and program information
    let new_preview = this.switcher.listVisibleInputs("preview", 0)
    let new_program = this.switcher.listVisibleInputs("program", 0)

    console.log(`PREVIEW: ${new_preview}`)
    this.preview = new_preview

    console.log(`PROGRAM: ${new_program}`)
    this.program = new_program



  }

  connect() {
    console.log(`Connecting to ${this.ip}...`);
    this.switcher.connect(this.ip)
  }

}

let atem = new Main("192.168.178.140")
atem.connect()