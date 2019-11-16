import { Console } from './console'
import { Motor } from './motor';
import { GPIO } from './gpio';
import { F450 } from './f450';
import WPIFFI from './wiringpi-ffi';

async function main() {
  WPIFFI.wiringPiSetup();
  await (new Console()).Run();
  process.exit(0);
}

main();
