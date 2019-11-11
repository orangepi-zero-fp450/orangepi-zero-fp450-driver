import { Motor } from '../motor';
import { GPIO } from '../gpio';

export class F450 {
  private wiringPiInit: boolean = false;
  private motor1: Motor;
  private motor2: Motor;
  private motor3: Motor;
  private motor4: Motor;

  public get Motor1(): Motor {
    return this.motor1;
  }
  public get Motor2(): Motor {
    return this.motor2;
  }
  public get Motor3(): Motor {
    return this.motor3;
  }
  public get Motor4(): Motor {
    return this.motor4;
  }

  // 初始化全部电机
  public Init(): Promise<void[]> {
    return Promise.all([
      this.Motor1.Init(),
      this.Motor2.Init(),
      this.Motor3.Init(),
      this.Motor4.Init()
    ]);
  }
  // 设置全部电机档位（0 ~ 10）
  public GearSet(gear: number): void {
    this.Motor1.GearSet(gear);
    this.Motor2.GearSet(gear);
    this.Motor3.GearSet(gear);
    this.Motor4.GearSet(gear);
  }
  // 临时设置全部电机档位并持续一段时间（多用于调试）
  public GearSetTimeout(gear: number, s: number): Promise<void[]> {
    return Promise.all([
      this.Motor1.GearSetTimeout(gear, s),
      this.Motor2.GearSetTimeout(gear, s),
      this.Motor3.GearSetTimeout(gear, s),
      this.Motor4.GearSetTimeout(gear, s),
    ]);
  }

  public constructor() {
    this.motor1 = new Motor(GPIO.GPIO0);
    this.motor2 = new Motor(GPIO.GPIO2);
    this.motor3 = new Motor(GPIO.GPIO3);
    this.motor4 = new Motor(GPIO.GPIO7);
  }
}
