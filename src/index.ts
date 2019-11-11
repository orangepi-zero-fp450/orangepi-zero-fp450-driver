import { Console } from './console'
import { Motor } from './motor';
import { GPIO } from './gpio';
import { F450 } from './f450';


async function main() {
  // await (new Console).Run();
  // process.exit(0);
  // const m = new Motor(GPIO.GPIO0);
  // await m.Init();
  const f450 = new F450();
  await f450.Init();
  f450.GearSet(10);
  f450.GearSetTimeout(5, 5);
  f450.Motor2.GearSet(2);
}

main();
