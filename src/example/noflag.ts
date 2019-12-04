require("source-map-support").install();

import {
  makeCommand,
  makeNumberArgument,
  makeStringArgument,
  makePositionalArguments
} from "../main";

const args = makePositionalArguments(
  makeNumberArgument("num"),
  makeStringArgument("str")
);

const command = makeCommand({
  name: "example",
  description: "catacli is typescript-friendly commander tool",
  version: "0.0.1",
  usage: "simple [OPTIONS] arg1",
  positionalArguments: args,
  handler: args => {
    console.log(args.num);
    console.log(args.str);
  }
});

command(process.argv.splice(2));
