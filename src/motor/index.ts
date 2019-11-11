import { GPIO } from "../gpio";
import PWM from '../libpwm';

// 电机类
// 封装了电机状态，电机控制方法，电调初始化方法
export class Motor {
  // 控制电机的GPIO口
  private gpio: GPIO;
  // PWM是否初始化标志
  private pwmInitialized: boolean;
  // 电调是否初始化标志
  private controllerInitialized: boolean;
  // 当前电机转速档位
  private gear: number;

  // 获取控制电机的GPIO口
  public get GPIO(): GPIO {
    return this.gpio;
  }
  // 获取PWM初始化状态
  public get PWMInitialized() {
    return this.pwmInitialized;
  }
  // 获取电调初始化状态
  public get ControllerInitialized() {
    return this.controllerInitialized;
  }
  // 获取总的电机初始化状态（PWM且电调）
  public get Initialized() {
    return this.PWMInitialized && this.ControllerInitialized;
  }
  // 获取电机当前档位
  public get Gear(): number {
    return this.gear;
  }

  // 初始化PWM（这是一个底层的方法）
  private pwmInit(min: number = 0, max: number = 200) {
    console.log(`pwmInit: ${min} ${max}`);
    PWM.PWMInit(this.gpio, min, max);
  }
  // 设置脉冲（这是一个底层的方法）
  private pulseSet(value: number) {
    if (!this.PWMInit) {
      console.log('pwm not initialized');
      return;
    }
    // 设置脉冲
    console.log(`pulseSet: ${value}`);
    PWM.PWMSet(this.gpio, value);
  }

  // 初始化PWM
  public PWMInit(): void {
    if (!this.PWMInitialized) {
      this.pwmInit();
      this.pwmInitialized = true;
    } else {
      console.log('pwm already initialized');
    }
  }
  // 初始化电调（这是一个异步方法）
  public ControllerInit(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.PWMInitialized) {
        reject('pwm not initialized');
      }
      if (!this.ControllerInitialized) {
        this.pulseSet(20);
        setTimeout(() => {
          this.pulseSet(10);
          this.controllerInitialized = true;
          resolve();
        }, 2500);
      } else {
        console.log('controller already initialized');
        resolve();
      }
    });
  }
  // 初始化电机（包含PWM与电调）
  public async Init(): Promise<void> {
    this.PWMInit();
    await this.ControllerInit();
  }
  // 设置电机档位（0 ~ 10）
  public GearSet(gear: number): void {
    if (!this.PWMInit) {
      console.log('pwm not initialized');
      return;
    }
    if (!this.ControllerInit) {
      console.log('controller not initialized');
      return;
    }
    if (gear < 0 || gear > 10) {
      console.log('the range of gear must be [0 ~ 10]');
      return;
    }
    const floorGear = Math.floor(gear);
    const value = floorGear + 10;
    // 设置脉冲信号
    this.pulseSet(value);
    // 写入当前档位
    this.gear = floorGear;
  }
  // 临时设置电机档位并持续一段时间（多用于调试）
  public GearSetTimeout(gear: number, s: number): Promise<void> {
    return new Promise<void>((resolve) => {
      const ms = Math.floor(s * 1000);
      const bakGear = this.gear;
      this.GearSet(gear);
      setTimeout(() => {
        this.GearSet(bakGear);
        resolve();
      }, ms);
    });
  }

  // 构造函数（传入控制电机的GPIO口）
  public constructor(gpio: GPIO) {
    this.gpio = gpio;
    this.pwmInitialized = false;
    this.controllerInitialized = false;
    this.gear = 0;
  }
}
