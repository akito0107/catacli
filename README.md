# marron-glace

Super TypeScript-friendly commander helper.

## install

```$xslt
$ npm install marron-glace
```

## usage

### Simple Command
Using `composeFlag`, `makePositionalArguments` and `makeCommand`, you can implements handler functions with typed args.
```ts
import {
  makeBooleanFlag,
  makeNumberFlag,
  makeStringFlag,
  makeCommand,
  composeFlag,
  makeStringArgument,
  makePositionalArguments
} from "marron-glace";

const booleanFlag = makeBooleanFlag("opts1", {
  usage: "boolean example"
});
const numberFlag = makeNumberFlag("opts2", {
  default: 1, // you can pass default value,
  usage: "number example"
});
const stringFlag = makeStringFlag("opts3", {
  alias: "a", // you can specify alias (shot-hand flag)
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
  positionalArguments: args,
  handler: (args, opts) => {
    /* YOUR COMMAND LOGIC IS HERE */
    console.log("positionalArgs: ", args.arg1); // ok and inferred as string type
    console.log("flag opts1: ", opts.opts1); // ok and inferred as boolean type
    console.log("flag opts2: ", opts.opts2); // ok and inferred as number type
    console.log("flag opts3: ", opts.opts3); // ok and inferred as string type
    // opts.arg4; // ng compile error
  }
});

command(process.argv.splice(2));
```

running with [ts-node](https://github.com/TypeStrong/ts-node)
```$xslt
$ ts-node main.ts --opts1 --opts2 123 --opts3 test args
```

and got these outputs.
```$xslt
positionalArgs:  { value: 'args', position: [ 5 ] }
flag opts1:  { value: true, option: { usage: 'boolean example' }, position: [ 0 ] }
flag opts2:  {
  value: 123,
  option: { default: 1, usage: 'number example' },
  position: [ 1, 2 ]
}
flag opts3:  {
  value: 'test',
  option: { alias: 'a', usage: 'string example' },
  position: [ 3, 4 ]
}
```

#### Short-hand flag
`--opts3` is also acceptable with `-a` flag.

```$xslt
% ts-node main.ts --opts1 --opts2 123 -a test args
positionalArgs:  { value: 'args', position: [ 5 ] }
flag opts1:  { value: true, option: { usage: 'boolean example' }, position: [ 0 ] }
flag opts2:  {
  value: 123,
  option: { default: 1, usage: 'number example' },
  position: [ 1, 2 ]
}
flag opts3:  {
  value: 'test',
  option: { alias: 'a', usage: 'string example' },
  position: [ 3, 4 ]
}
```

#### with Help
You can show rich help texts with `--help` flag by default.

```$xslt
$ ts-node main.ts --opts1 -a test --opts3 123 args --help
NAME:
   example - marron-glace is typescript-friendly commander tool

USAGE:
   simple [OPTIONS] arg1

VERSION:
  0.0.1

ARGUMENTS:
	 arg1

OPTIONS:
	--help  	 show help
	--opts1  	 boolean example
	--opts2  	 number example	default=1
	--opts3, -a  	 string example
```

### SubCommands
You can create subcommnds with `makeSubCommandHandler`.

```ts
import {
  makeBooleanFlag,
  makeNumberFlag,
  makeStringFlag,
  makeCommand,
  composeFlag,
  makeStringArgument,
  makePositionalArguments,
  makeSubCommandHandler,
  makeSubCommandNameArgument
} from "marron-glace";

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
  description: "marron-glace subcommand example (sub1)",
  version: "0.0.1",
  usage: "example [OPTIONS] sub1 [SUB COMMAND OPTIONS]",
  flag: sub1Flag,
  positionalArguments: args,
  handler: (args, flags) => {
    console.log(args.arg1);
    console.log(flags.subflag1);
  }
});

const sub2Flag = composeFlag(flags, makeStringFlag("subflag2"));

const subCommand2 = makeCommand({
  name: "sub2",
  description: "marron-glace subcommand example (sub2)",
  version: "0.0.1",
  usage: "example [OPTIONS] sub2 [SUB COMMAND OPTIONS]",
  flag: sub2Flag,
  handler: (_, flags) => {
    console.log(flags.subflag2);
  }
});

const commandNames = makePositionalArguments(
  makeSubCommandNameArgument("sub1", "sub2")
);

const command = makeCommand({
  name: "example",
  description: "marron-glace is typescript-friendly commander tool",
  version: "0.0.1",
  usage: "simple [OPTIONS] [COMMAND_NAME] [SUB COMMAND OPTIONS]",
  flag: flags,
  /* YOU MUST SPECIFY positionalArguments with `makeSubCommandNameArgument` */
  positionalArguments: commandNames, /* YOU MUST SPECIFY positionalArguments with `makeSubCommandNameArgument` */
  /* passing sub commands with commandName to `makeSubCommandHandler()` */
  handler: makeSubCommandHandler(
    { name: "sub1", command: subCommand1 },
    { name: "sub2", command: subCommand2 }
  )
});

command(process.argv.splice(2));
```

running with [ts-node](https://github.com/TypeStrong/ts-node)
```
$ ts-node main.ts  --opts1 --opts2 123 --opts3 test  sub1  --subflag1 test sub-positional-args
{ arg1: { value: 'sub-positional-args', position: [ 8 ] } }
{
  help: { value: undefined, option: { usage: 'show help' } },
  opts1: {
    value: true,
    option: { usage: 'boolean example' },
    position: [ 0 ]
  },
  opts2: {
    value: 123,
    option: { default: 1, usage: 'number example' },
    position: [ 1, 2 ]
  },
  opts3: {
    value: 'test',
    option: { alias: 'a', usage: 'string example' },
    position: [ 3, 4 ]
  },
  subflag1: { value: 'test', option: {}, position: [ 6, 7 ] }
}
```

and also shows rich help texts with `--help`.

```$xslt
% ts-node main.ts  --opts1 --opts2 123 --opts3 test  sub1  --subflag1 test sub-positional-args --help

NAME:
   example sub1 - marron-glace subcommand example (sub1)

USAGE:
   example [OPTIONS] sub1 [SUB COMMAND OPTIONS]

VERSION:
  0.0.1

ARGUMENTS:
	 arg1

OPTIONS:
	--opts3, -a  	 string example
	--opts2  	 number example	default=1
	--opts1  	 boolean example

SUB OPTIONS:
	--subflag1
	--help  	 show help
```


## License

This project is licensed under the Apache License 2.0 License - see the [LICENSE](LICENSE) file for details
