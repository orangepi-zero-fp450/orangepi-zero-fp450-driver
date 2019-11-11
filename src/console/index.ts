import colors from 'colors';
import readline from 'readline';

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
  private selectCommand(name: string) {
    if (name) {
      const devMap: any = {
        'gpio0': 'gpio0',
        'gpio2': 'gpio2',
        'gpio3': 'gpio3',
        'gpio7': 'gpio7',
        'gpioall': 'gpioall',
        '0': 'gpio0',
        '2': 'gpio2',
        '3': 'gpio3',
        '7': 'gpio7',
        'all': 'gpioall',
        'mpu': 'mpu',
      };
      if (devMap[name]) {
        this.curDevice = devMap[name];
      } else {
        console.log(`device ${name} does not exist`);
      }
    } else {
      console.log('please select a device');
    }
  }

  // 命令匹配
  private matchCommands(substrs: string[]) {
    const cmd = substrs[0];
    if (cmd === 'select') {
      this.selectCommand(substrs[1]);
    } else if (cmd === 'init') {

    } else if (isFinite(Number(cmd))) {
      this.pulseSetCommand(Math.floor(Number(cmd)));
    } else {
      console.log('unknown command');
    }
  }

  public async Run(): Promise<void> {
    console.log('[--------F430 Console v1.1--------]');
    while (true) {
      const input = (await Console.readline(`${this.curDevice ? `[${this.curDevice}]` : ''}>> `)).trim().toLowerCase();
      if (input) {
        if (!input.startsWith('exit') && input !== 'e') {
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
