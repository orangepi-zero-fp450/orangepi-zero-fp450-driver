import { Console } from './console'
import { Motor } from './motor';
import { GPIO } from './gpio';
import { F450 } from './f450';
import WPIFFI from './wiringpi-ffi';
// import fs from 'fs';

async function main() {
  WPIFFI.wiringPiSetup();
  await (new Console()).Run();
  process.exit(0);
  // const text = fs.readFileSync('script.txt', 'utf-8')
  // console.log(text.split('\n').filter((row) => row));
}

main();
