import { GPIO } from "../gpio";
import WPIFFI from '../wiringpi-ffi';

/**
 * 电机类
 * 封装了PWM，电调的初始化方法以及电机档位的控制方法
 */
export class Motor {
  /**
   * 控制电机的GPIO口
   */
  private gpio: GPIO;
  /**
   * 是否已经初始化PWM
   */
  private pwmInitialized: boolean;
  /**
   * 是否已经初始化电调
   */
  private controllerInitialized: boolean;
  /**
   * 当前电机转速档位
   */
  private gear: number;

  /**
   * 获取控制电机的GPIO口
   */
  public get GPIO(): GPIO {
    return this.gpio;
  }
  /**
   * 获取PWM的初始化状态
   */
  public get PWMInitialized() {
    return this.pwmInitialized;
  }
  /**
   * 获取电调的初始化状态
   */
  public get ControllerInitialized() {
    return this.controllerInitialized;
  }
  /**
   * 获取电机的初始化状态（PWM且电调）
   */
  public get Initialized() {
    return this.PWMInitialized && this.ControllerInitialized;
  }
  /**
   * 获取电机的当前档位
   */
  public get Gear(): number {
    return this.gear;
  }

  /**
   * 调用FFI初始化PWM
   * @param value 初始化的脉冲宽度值
   * @param range 脉冲可调范围
   */
  private pwmInit(value: number = 0, range: number = 200) {
    console.log(`[${this.gpio}] init: ${value} ${range}`);
    WPIFFI.softPwmCreate(this.gpio, value, range);
  }
  /**
   * 调用FFI设置PWM脉冲
   * @param value 脉冲值，默认配置下，此值的范围为[0 ~ 200]
   */
  private pulseSet(value: number) {
    if (!this.PWMInit) {
      console.log('pwm not initialized');
      return;
    }
    // 设置脉冲
    console.log(`[${this.gpio}] set: ${value}`);
    WPIFFI.softPwmWrite(this.gpio, value);
  }

  /**
   * 初始化PWM，即使能GPIO口的PWM时钟
   * 这里设置时钟为200个单位，即：1s / (200 * 100us) = 50hz
   */
  public PWMInit(): void {
    if (!this.PWMInitialized) {
      this.pwmInitialized = true;
      this.pwmInit(0, 200);
    } else {
      console.log('pwm already initialized');
    }
  }
  /**
   * @async
   * 初始化控制电机的电调
   * 因为电调初始化协议有时序性，所以这里使用setTimeout异步延时发送初始化信号
   * 整个初始化过程会异步等待约10秒钟
   * 如不能确定电机状态，请谨慎调用，二次初始化会导致油门开到最大
   * 新西达电调的初始化协议，这里简单描述一下
   * 1.初始化PWM时钟，使其能在GPIO口产生PWM信号（本程序的PWM频率为：1s / (200 * 100us) = 50hz，11个档位）
   * 2.输出2ms的PWM脉冲，为设定的油门最大值
   * 3.听到短促的滴滴声音后，输出1ms的PWM脉冲，设定的油门最小值
   * 4.等待几秒钟之后，发送1ms~2ms之间的PWM脉冲，即可启动电机
   */
  public ControllerInit(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // 如果PWM没有初始化则报错
      if (!this.PWMInitialized) {
        reject('pwm not initialized');
      }
      // 如果电调并未初始化
      if (!this.ControllerInitialized) {
        // 这里先设置了标志，防止异步重入的错误
        this.controllerInitialized = true;
        // 发送高脉冲
        this.pulseSet(20);
        // 延时发送低脉冲
        setTimeout(() => {
          this.pulseSet(10);
          // 等待初始化完成返回
          setTimeout(() => {
            resolve();
          }, 7000);
        }, 3000);
      } else {
        console.log('controller already initialized');
        resolve();
      }
    });
  }
  /**
   * @async
   * 初始化电机
   * 首先会初始化控制电机的GPIO口以使能PWM信号
   * 其次会初始化控制电机的电调并异步等待完成
   */
  public async Init(): Promise<void> {
    this.PWMInit();
    await this.ControllerInit();
  }
  /**
   * 设置电机档位
   * @param gear 电机档位，可调范围为[0 ~ 10]
   */
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
    // 实际脉冲范围为[10 ~ 20]
    const value = floorGear + 10;
    // 设置脉冲信号
    this.pulseSet(value);
    // 写入当前档位
    this.gear = floorGear;
  }
  /**
   * 设置电机档位并持续一段时间后退回之前的档位
   * @param gear 电机档位，可调范围为[0 ~ 10]
   * @param s 档位保持的时间，单位秒，超出此时间之后档位将会退回到之前的状态
   * @param keep 是否回退
   */
  public GearSetTimeout(
    gear: number,
    s: number,
    keep: boolean = false,
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      const ms = Math.floor(s * 1000);
      const bakGear = this.gear;
      this.GearSet(gear);
      setTimeout(() => {
        if (!keep) {
          this.GearSet(bakGear);
        }
        resolve();
      }, ms);
    });
  }
  /**
   * @constructor 构造函数，创建一个可用的电机对象
   * @param gpio 控制电机的GPIO口，具体请查看实际硬件连接与OrangePi Zero的GPIO定义
   */
  public constructor(gpio: GPIO) {
    this.gpio = gpio;
    this.pwmInitialized = false;
    this.controllerInitialized = false;
    this.gear = 0;
  }
}
