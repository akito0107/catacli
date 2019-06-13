require("source-map-support").install();

import {
  makeBooleanFlag,
  makeNumberFlag,
  makeStringFlag,
  makeCommand,
  composeFlag
} from "../main";
import { makeStringArgument, makePositionalArguments } from "../args";

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

const flags = composeFlag(booleanFlag, numberFlag, stringFlag);
const args = makePositionalArguments(stringArg);

const command = makeCommand({
  name: "example",
  description: "marron-glace is typescript-friendly commander tool",
  version: "0.0.1",
  usage: "simple [OPTIONS] arg1",
  flag: flags,
  potisionalArguments: args,
  handler: (args, opts) => {
    console.log(args.arg1); // ok and inferred as string type
    console.log(opts.opts1); // ok and inferred as boolean type
    console.log(opts.opts2); // ok and inferred as number type
    console.log(opts.opts3); // ok and inferred as string type
    // opts.arg4; // ng compile error
  }
});

command(process.argv.splice(2));
