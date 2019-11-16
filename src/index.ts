import { Console } from './console'
import { Motor } from './motor';
import { GPIO } from './gpio';
import { F450 } from './f450';
import WPIFFI from './wiringpi-ffi';


async function main() {
  WPIFFI.wiringPiSetup();
  const f450 = new F450();
  await f450.Init();
  console.log('所有电机初始化完成');
  await f450.GearSetTimeout(1, 5);
  await f450.GearSetTimeout(2, 4);
  await f450.GearSetTimeout(3, 3);
  await f450.GearSetTimeout(5, 0.2);
  f450.GearSet(0);
}

main();
