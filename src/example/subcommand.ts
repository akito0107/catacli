require("source-map-support").install();

import {
  makeBooleanFlag,
  makeNumberFlag,
  makeStringFlag,
  makeCommand,
  composeFlag
} from "../main";
import { makeStringArgument, makePositionalArguments } from "../args";
import { makeSubCommandHandler } from "../command";

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

const flags = composeFlag(booleanFlag, numberFlag, stringFlag);
const sub1Flag = composeFlag(flags, makeStringFlag("subflag1"));

const stringArg = makeStringArgument("arg1");
const args = makePositionalArguments(stringArg);

const subCommand1 = makeCommand({
  name: "sub1",
  description: "marron-glace subcommand example",
  flag: sub1Flag,
  potisionalArguments: args,
  handler: (args, flags) => {
    console.log(args.arg1);
    console.log(flags.subflag1);
  }
});

const sub2Flag = composeFlag(flags, makeStringFlag("subflag2"));

const subCommand2 = makeCommand({
  name: "sub2",
  description: "marron-glace subcommand example",
  flag: sub2Flag,
  handler: (_, flags) => {
    console.log(flags.subflag2);
  }
});

const command = makeCommand({
  name: "example",
  description: "marron-glace is typescript-friendly commander tool",
  version: "0.0.1",
  usage: "simple [OPTIONS] [SUB COMMAND] [SUB COMMAND OPTIONS]",
  flag: flags,
  handler: makeSubCommandHandler(
    { name: "sub1", command: subCommand1 },
    { name: "sub2", command: subCommand2 }
  )
});

command(process.argv.splice(2));
