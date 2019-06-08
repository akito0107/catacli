import {
  makeBooleanFlag,
  makeNumberFlag,
  makeStringFlag,
  makeCommand,
  composeFlag
} from "../main";

const booleanFlag = makeBooleanFlag("arg1");
const numberFlag = makeNumberFlag("arg2", {
  default: 1 // you can pass default value
});
const stringFlag = makeStringFlag("arg3", {
  alias: "a" // you can specify alias value
});

const flags = composeFlag(booleanFlag, numberFlag, stringFlag);

const command = makeCommand({
  name: "example",
  flag: flags,
  handler: opts => {
    console.log(opts.arg1); // ok and inferred as boolean type
    console.log(opts.arg2); // ok and inferred as number type
    console.log(opts.arg3); // ok and inferred as string type
    // opts.arg4; // ng compile error
  }
});

command(process.argv.splice(2));
