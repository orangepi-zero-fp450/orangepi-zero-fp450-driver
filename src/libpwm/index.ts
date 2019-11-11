import ffi from 'ffi';
import { GPIO } from '../gpio';

// FFI封装的PWM动态库调用
class LibPWM {
  private funcWiringPiInit: any;
  private funcPWMInit: any;
  private funcPWMSet: any;

  public WiringPiInit(): void {
    this.funcWiringPiInit();
  }
  public PWMInit(gpio: GPIO, min: number, max: number): void {
    this.funcPWMInit(gpio, min, max);
  }
  public PWMSet(gpio: GPIO, value: number): void {
    this.funcPWMSet(gpio, value);
  }

  public constructor() {
    this.funcWiringPiInit = ffi.Library('libpwm', {
      'WiringPiInit': ['void', []],
    }).WiringPiInit;
    this.funcPWMInit = ffi.Library('libpwm', {
      'PWMInit': ['void', ['int', 'int', 'int']],
    }).PWMInit;
    this.funcPWMSet = ffi.Library('libpwm', {
      'PWMSet': ['void', ['int', 'int']],
    }).PWMSet;
  }
}

export default new LibPWM();
