import { makeCommand } from "../command";
import { composeFlag, makeStringFlag } from "../flag";

const globalFlag = composeFlag(makeStringFlag("global1"));

// command(process.argv.splice(2))

const command = makeCommand({
  name: "test",
  flag: globalFlag,
});
