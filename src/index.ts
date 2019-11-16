import { Console } from './console'
import { Motor } from './motor';
import { GPIO } from './gpio';
import { F450 } from './f450';
import PWM from './libpwm';


async function main() {
  PWM.WiringPiInit();
  const f450 = new F450();
  await f450.Init();
  console.log('所有电机初始化完成');
  await f450.GearSetTimeout(1, 10);
  await f450.GearSetTimeout(2, 10);
  await f450.GearSetTimeout(1, 10);
  await f450.GearSetTimeout(2, 10);
  await f450.GearSetTimeout(1, 10);
  await f450.GearSetTimeout(2, 10);
  await f450.GearSetTimeout(1, 10);
  await f450.GearSetTimeout(2, 10);
  await f450.GearSetTimeout(0, 10);
  await f450.GearSetTimeout(1, 5);
  await f450.GearSetTimeout(2, 5);
  await f450.GearSetTimeout(3, 5);
  await f450.GearSetTimeout(2, 5);
  await f450.GearSetTimeout(1, 5);
  await f450.GearSetTimeout(0, 10);
}

main();
