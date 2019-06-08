import { makeCommand } from "../command";
import { composeFlag, makeStringFlag } from "../flag";

const globalFlag = composeFlag(makeStringFlag("str-flg"));
const localFlag = makeStringFlag("sub1");

// command(process.argv.splice(2))

const command = makeCommand({
  name: "test",
  flag: globalFlag,
  subCommands: [
    makeCommand({
      name: "sub1",
      flag: composeFlag(globalFlag, localFlag),
      handler: flag => {
      }
    })
  ]
});
