import ffi from 'ffi';
import { GPIO } from '../gpio';

/**
 * @class
 * wiringPi 的 node-ffi 类
 */
class wiringPiFFI {
  private libwiringPi: any;

  /**
   * wiringPi安装
   * @returns 安装结果
   */
  public wiringPiSetup(): number {
    return this.libwiringPi.wiringPiSetup();
    return 0;
  }
  /**
   * 在某一个GPIO口上初始化PWM
   * @param gpio GPIO口
   * @param value 初始化的PWM脉冲宽度
   * @param range PWM脉冲宽度范围
   * @returns PWM初始化结果
   */
  public softPwmCreate(
    gpio: GPIO,
    value: number,
    range: number
  ): number {
    return this.libwiringPi.softPwmCreate(gpio, value, range);
    return 0;
  }
  /**
   * 设置PWM脉冲宽度
   * @param gpio GPIO口
   * @param value 新的脉冲宽度
   */
  public softPwmWrite(
    gpio: GPIO,
    value: number,
  ): void {
    return this.libwiringPi.softPwmWrite(gpio, value);
  }

  /**
   * @constructor
   * 构造函数
   * 从 /usr/local/libwiringPi.so 构建 node-ffi 对象
   */
  public constructor() {
    this.libwiringPi = ffi.Library('libwiringPi', {
      'wiringPiSetup': ['int', []],
      'softPwmCreate': ['int', ['int', 'int', 'int']],
      'softPwmWrite': ['void', ['int', 'int']],
    });
  }
}

export default new wiringPiFFI();
