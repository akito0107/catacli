/* eslint no-console: 0 */
require("source-map-support").install();

import {
  makeBooleanFlag,
  makeNumberFlag,
  makeStringFlag,
  makeCommand,
  reduceFlag,
  makeStringArgument,
  makePositionalArguments
} from "../main";

const booleanFlag = makeBooleanFlag("opts1", {
  usage: "boolean example"
});
const numberFlag = makeNumberFlag("opts2", {
  default: 1, // you can pass default value,
  usage: "number example"
});
const stringFlag = makeStringFlag("opts3", {
  alias: "a", // you can specify alias value
  usage: "string example"
});

const stringArg = makeStringArgument("arg1");

const flags = reduceFlag(booleanFlag, numberFlag, stringFlag);
const args = makePositionalArguments(stringArg);

const command = makeCommand({
  name: "example",
  description: "marron-glace is typescript-friendly commander tool",
  version: "0.0.1",
  usage: "simple [OPTIONS] arg1",
  flag: flags,
  positionalArguments: args,
  handler: (args, opts) => {
    console.log("positionalArgs: ", args.arg1.value); // ok and inferred as string type
    console.log("flag opts1: ", opts.opts1.value); // ok and inferred as boolean type
    console.log("flag opts2: ", opts.opts2.value); // ok and inferred as number type
    console.log("flag opts3: ", opts.opts3.value); // ok and inferred as string type
    // opts.arg4; // ng compile error
  }
});

command(process.argv.splice(2));
