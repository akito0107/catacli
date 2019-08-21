/* eslint no-console: 0 */
require("source-map-support").install();

import {
  makeBooleanFlag,
  makeNumberFlag,
  makeStringFlag,
  makeCommand,
  reduceFlag,
  makeStringArgument,
  makePositionalArguments,
  makeSubCommandHandler,
  makeSubCommandNameArgument
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

const flags = reduceFlag(booleanFlag, numberFlag, stringFlag);
const sub1Flag = reduceFlag(flags, makeStringFlag("subflag1"));

const stringArg = makeStringArgument("arg1");
const args = makePositionalArguments(stringArg);

const subCommand1 = makeCommand({
  name: "sub1",
  description: "catacli subcommand example (sub1)",
  version: "0.0.1",
  usage: "example [OPTIONS] sub1 [SUB COMMAND OPTIONS]",
  flag: sub1Flag,
  positionalArguments: args,
  handler: (args, flags) => {
    console.log("arg1: ", args.arg1.value);
    console.log("opts1: ", flags.opts1.value);
    console.log("opts2: ", flags.opts2.value);
    console.log("opts3: ", flags.opts3.value);
    console.log("subflag1: ", flags.subflag1.value);
  }
});

const sub2Flag = reduceFlag(flags, makeStringFlag("subflag2"));

const subCommand2 = makeCommand({
  name: "sub2",
  description: "catacli subcommand example (sub2)",
  version: "0.0.1",
  usage: "example [OPTIONS] sub2 [SUB COMMAND OPTIONS]",
  flag: sub2Flag,
  handler: (_, flags) => {
    console.log("subflag2: ", flags.subflag2.value);
  }
});

const commandNames = makePositionalArguments(
  makeSubCommandNameArgument("sub1", "sub2")
);

const command = makeCommand({
  name: "example",
  description: "catacli is typescript-friendly commander tool",
  version: "0.0.1",
  usage: "simple [OPTIONS] [COMMAND_NAME] [SUB COMMAND OPTIONS]",
  flag: flags,
  positionalArguments: commandNames,
  handler: makeSubCommandHandler(
    { name: "sub1", command: subCommand1 },
    { name: "sub2", command: subCommand2 }
  )
});

command(process.argv.splice(2));
