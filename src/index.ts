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
  await f450.GearSetTimeout(1, 5);
  await f450.GearSetTimeout(2, 4);
  await f450.GearSetTimeout(3, 3);
  await f450.GearSetTimeout(4, 0.7);
  await f450.GearSetTimeout(3, 3);
  f450.GearSet(0);
}

main();
