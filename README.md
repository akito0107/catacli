# marron-glace

## Super TypeScript-friendly command line parser.

## install

TBD

## usage

```ts
import {
  makeBooleanFlag,
  makeNumberFlag,
  makeStringFlag,
  makeCommand,
  composeFlag,
  run
} from "../marron-glace";

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

run(process.argv.splice(2), command);
```

## License

This project is licensed under the Apache License 2.0 License - see the [LICENSE](LICENSE) file for details
