import readline from 'readline';
import 'colors';
import { F450 } from '../f450';
import { Motor } from '../motor';

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

  private static f450: F450 = new F450();

  // 当前Select的设备
  private curDevices: string[] = [];

  /**
   * 根据Motor设备名列表组合Motor设备列表
   * @param strs Motor设备名列表
   */
  private namesToMotors(strs: string[]): Motor[] {
    return strs.map((str) => (Console.f450 as any)[`Motor${str.replace('m', '')}`] as Motor);
  }

  /**
   * 脉冲设置命令
   * @param args 参数列表
   */
  private async pulseSetCommand(args: string[]): Promise<void> {
    if (this.curDevices.length > 0) {
      const mtrRegx = /^m[1-4]$/;
      if (this.curDevices.every((dev) => mtrRegx.test(dev))) {
        // 档位值
        const value = Math.floor(Number(args[0]));
        // 当前选中的电机列表
        const motors = this.namesToMotors(this.curDevices);
        if (args.length < 2) {
          motors.forEach((motor) => motor.GearSet(value));
        } else {
          let timelen = Number(args[1]);
          if (isFinite(timelen) && timelen >= 0) {
            if (args.length > 3) {
              console.log(`redundant args: ${args.slice(3).join(' ')}`);
            }
            await Promise.all(motors.map((motor) => motor.GearSetTimeout(value, timelen, args[2] === 'k')));
          } else {
            console.log(`illegal param timelen ${args[1]}`);
          }
        }
      } else {
        console.log('only motor devices are supported');
      }
    } else {
      console.log('please select motor');
    }
  }

  /**
   * 设备选择命令
   * @param args 参数列表
   */
  private selectCommand(args: string[]): void {
    // 设备名称字典
    const deviceDict: any = {
      '1': ['m1'],
      '2': ['m2'],
      '3': ['m3'],
      '4': ['m4'],
      'all': ['m1', 'm2', 'm3', 'm4'],
      'mpu': ['mpu'],
      'alt': ['alt'],
    };
    if (args.length > 0) {
      const mtrRegx = /^[1-4]|all$/;
      const devRegx = /^mpu|alt$/;
      const devices: string[] = [];
      let i = 0;
      for (; i < args.length; ++i) {
        const arg = args[i];
        if (mtrRegx.test(arg)) {
          devices.push(...deviceDict[arg]);
        } else if (devRegx.test(arg)) {
          if (i > 0 && !devRegx.test(args[i - 1])) {
            console.log(`can't mix the motor device and other device ${arg}`);
            return;
          } else {
            devices.push(...deviceDict[arg]);
          }
          i++;
          break;
        } else {
          console.log(`unknown device ${arg}`);
          return;
        }
      }
      // 参数多余提示
      if (i < args.length) {
        const reduArgs = args.slice(i);
        console.log(`redundant args: ${reduArgs.join(' ')}`);
      }
      const devicesSet = new Set(devices);
      this.curDevices = Array.from(devicesSet);
    } else {
      console.log('please select a device');
    }
  }
  /**
   * 设备初始化命令
   * @param args 参数列表
   */
  private async initCommand(args: string[]): Promise<void> {
    if (this.curDevices.length > 0) {
      await Promise.all(this.curDevices.map((dev) => {
        if (dev === 'm1') {
          return Console.f450.Motor1.Init();
        } else if (dev === 'm2') {
          return Console.f450.Motor2.Init();
        } else if (dev === 'm3') {
          return Console.f450.Motor3.Init();   
        } else if (dev === 'm4') {
          return Console.f450.Motor4.Init();
        } else {
          return new Promise<void>((resolve) => { resolve() });
        }
      }));
    } else {
      console.log('no device is currently selected');
    }
  }

  private async detailCommand(args: string[]): Promise<void> {
    
  }

  // 命令匹配
  private async matchCommands(substrs: string[]): Promise<void> {
    const cmd = substrs[0];
    if (cmd === 'select') {
      this.selectCommand(substrs.slice(1));
    } else if (cmd === 'init') {
      await this.initCommand(substrs.slice(1));
    } else if(cmd === 'detail') {

    } else if (isFinite(Number(cmd))) {
      await this.pulseSetCommand(substrs);
    } else {
      console.log('unknown command');
    }
  }
  /**
   * 显示欢迎信息
   */
  private welcome(): void {
    console.log(`${'[--------'.green}${` F450 Console v1.1 `.bgGreen.black}${'--------]'.green}`);
  }
  /**
   * 读取命令行输入（带状态提示）
   */
  private async readCommand(): Promise<string> {
    const colorDict: any = {
      m1: {
        bgColor: 'bgGreen',
        color: 'black',
      },
      m2: {
        bgColor: 'bgGreen',
        color: 'black',
      },
      m3: {
        bgColor: 'bgGreen',
        color: 'black',
      },
      m4: {
        bgColor: 'bgGreen',
        color: 'black',
      },
      mpu: {
        bgColor: 'bgCyan',
        color: 'black',
      },
      alt: {
        bgColor: 'bgYellow',
        color: 'black',
      },
    };
    const tips = `${this.curDevices.length > 0 ? this.curDevices.map((dev) => ` ${dev} `[colorDict[dev].bgColor][colorDict[dev].color]).join('.') + ' ' : ''}>> `;
    return (await Console.readline(tips))
            .trim()
            .toLowerCase();
  }
  /**
   * 运行控制台
   */
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
          await this.matchCommands(substrs);
        } else {
          break;
        }
      }
    }
  }
  /**
   * @constructor
   * 构造函数
   */
  public constructor() {}
}
