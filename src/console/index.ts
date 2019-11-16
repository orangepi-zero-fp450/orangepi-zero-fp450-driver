import readline from 'readline';
import 'colors';

export class Console {
  // readline模块
  private static sysReadline: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  // 异步readline方法
  private static readline(ques: string): Promise<string> {
    return new Promise<string>((resolve) => {
      this.sysReadline.question(ques, (answer) => {
        resolve(answer);
      });
    });
  }

  // 当前Select的设备
  private curDevice: string = '';

  // 脉冲设置命令
  private pulseSetCommand(value: number) {
    
  }

  // 选择设备命令
  private selectCommand(args: string[]) {
    const deviceMap: any = {
      '1': ['motor1'],
      '2': ['motor2'],
      '3': ['motor3'],
      '4': ['motor4'],
      'all': ['motor1', 'motor2', 'motor3', 'motor4'],
      'mpu': ['mpu'],
      'alt': ['alt'],
    };
    if (args.length > 0) {
      const motorRegx = /^[1-4]|all$/;
      const notMotorRegx = /^mpu|alt$/;
      const devices: string[] = [];
      for (let i = 0; i < args.length; ++i) {
        const arg = args[i];
        if (motorRegx.test(arg)) {
          devices.push(...deviceMap[arg]);
        } else if (notMotorRegx.test(arg)) {
          devices.push(...deviceMap[arg]);
          break;
        } else {
          console.log(`unknown device ${arg}`);
        }
      }
      console.log(devices);
    } else {
      console.log('please select a device');
    }
  }

  // 命令匹配
  private matchCommands(substrs: string[]) {
    const cmd = substrs[0];
    if (cmd === 'select') {
      this.selectCommand(substrs.slice(1));
    } else if (cmd === 'init') {

    } else if (isFinite(Number(cmd))) {
      this.pulseSetCommand(Math.floor(Number(cmd)));
    } else {
      console.log('unknown command');
    }
  }

  private welcome(): void {
    console.log(`${'[--------'.green}${` F450 Console v1.1 `.bgGreen.black}${'--------]'.green}`);
  }

  private async readCommand(): Promise<string> {
    return (await Console.readline(`${this.curDevice ? `[${this.curDevice}]` : ''}>> `))
            .trim()
            .toLowerCase();
  }

  public async Run(): Promise<void> {
    this.welcome();
    while (true) {
      const input = await this.readCommand();
      if (input) {
        if (
          !input.startsWith('exit') &&
          !input.startsWith('quit') &&
          input !== 'e' &&
          input !== 'q'
        ) {
          const substrs = input.split(/\s+/);
          this.matchCommands(substrs);
        } else {
          break;
        }
      }
    }
  }

  public constructor() {}
}
