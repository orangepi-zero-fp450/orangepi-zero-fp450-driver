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
    const sMap = {
      '1': ['1'],
      '2': ['2'],
      '3': ['3'],
      '4': ['4'],
      'all': ['1', '2', '3', '4'],
      '*u': ['1'],
      '*d': ['4'],
      '*l': ['3'],
      '*r': ['2'],
      '#u': ['1', '2'],
      '#d': ['3', '4'],
      '#l': ['1', '3'],
      '#r': ['2', '4'],
    };
    if (args.length > 0) {
      const allNum = args.every((arg) => isFinite(Number(arg)));
      const allNotNum = args.every((arg) => !isFinite(Number(arg)));
      if (allNum) {

      } else if (allNotNum) {

      } else {
        console.log('不可混选设备');
      }
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

  public async Run(): Promise<void> {
    console.log(`${'[--------'.green}${` F450 Console v1.1 `.bgGreen.black}${'--------]'.green}`);
    while (true) {
      const input = (await Console.readline(`${this.curDevice ? `[${this.curDevice}]` : ''}>> `)).trim().toLowerCase();
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
