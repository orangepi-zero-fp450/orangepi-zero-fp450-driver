import { Console } from './console'
import { Motor } from './motor';
import { GPIO } from './gpio';


async function main() {
  // await (new Console).Run();
  // process.exit(0);
  const m = new Motor(GPIO.GPIO0);
  await m.Init();
  console.log('结束');
}

main();
