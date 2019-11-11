
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

  public constructor() {
    this.motor1 = new Motor(GPIO.GPIO0);
    this.motor2 = new Motor(GPIO.GPIO2);
    this.motor3 = new Motor(GPIO.GPIO3);
    this.motor4 = new Motor(GPIO.GPIO7);
  }
}
