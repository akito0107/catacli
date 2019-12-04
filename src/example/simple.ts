/* eslint no-console: 0 */
require("source-map-support").install();

import {
  makeBooleanFlag,
  makeNumberFlag,
  makeStringFlag,
  makeCommand,
  mergeFlag
} from "../main";

/*
1: string literalをkeyにしたobjectを返す関数の型 
*/
// --optsというflagを定義する
const booleanFlag = makeBooleanFlag("opts1", {
  usage: "boolean example"
});

const b = booleanFlag(["--opts"]);
console.log(b.opts1);

// --opts2 <number> というflagを定義する
const numberFlag = makeNumberFlag("opts2", {
  default: 1, // you can pass default value,
  usage: "number example"
});

// --opts3 <string> / -a <string> というflagを定義する
const stringFlag = makeStringFlag("opts3", {
  alias: "a", // you can specify alias (shot-hand flag)
  usage: "string example"
});

/*
2: 任意の数の関数を受け取り、型を合成する関数の型推論
 */
const flags = mergeFlag(booleanFlag, numberFlag, stringFlag);

const otherFlag = makeStringFlag("opts4");

const flags2 = mergeFlag(flags, otherFlag);

const command = makeCommand({
  name: "example",
  description: "catacli is typescript-friendly commander tool",
  version: "0.0.1",
  usage: "simple [OPTIONS] arg1",
  flag: flags2,
  handler: (_, opts) => {
    /* YOUR COMMAND LOGIC IS HERE */
    console.log("flag opts1: ", opts.opts1.value); // ok and inferred as boolean type
    console.log("flag opts2: ", opts.opts2.value); // ok and inferred as number type
    console.log("flag opts3: ", opts.opts3.value); // ok and inferred as string type
  }
});

command(["--opts1", "--opts2", "123", "-a", "short"]);