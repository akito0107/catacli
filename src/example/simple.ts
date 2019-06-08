import {
  makeBooleanFlag,
  makeNumberFlag,
  makeStringFlag,
  makeCommand,
  composeFlag
} from "../main";

const booleanFlag = makeBooleanFlag("arg1", {
  usage: "boolean example"
});
const numberFlag = makeNumberFlag("arg2", {
  default: 1, // you can pass default value,
  usage: "number example"
});
const stringFlag = makeStringFlag("arg3", {
  alias: "a", // you can specify alias value
  usage: "string example"
});

const flags = composeFlag(booleanFlag, numberFlag, stringFlag);

const command = makeCommand({
  name: "example",
  description: "marron-glace is typescript-friendly commander tool",
  version: "0.0.1",
  usage: "simple example",
  flag: flags,
  handler: opts => {
    console.log(opts.arg1); // ok and inferred as boolean type
    console.log(opts.arg2); // ok and inferred as number type
    console.log(opts.arg3); // ok and inferred as string type
    // opts.arg4; // ng compile error
  }
});

command(process.argv.splice(2));
