/* eslint no-console: 0 */
require("source-map-support").install();

import {
  makeBooleanFlag,
  makeCommand,
  reduceFlag,
  Flag,
  FlagOption,
  ParseResult
} from "../main";

type StringArrayFlag<N extends string> = Flag<string[], N>;

// function makeStringArrayFlag<N extends string>(
//   name: N,
//   option: FlagOption<string[]>
// ): StringArrayFlag<N> {
//   return (args: string[]) => {
//     // defaultは `--name` のように、`--`のprefixがつく
//     const flagName = `--${name}`;
//
//     // flagが渡された位置をとってくる
//     const idx = args.findIndex(a => a === flagName);
//
//     // --name <value1,value2,value3> として値が入っているので、flagの次の位置の値をとってきて `split`する
//     const values = args[idx + 1].split(",");
//
//     // 型キャストしてコンパイラを通す
//     return <ParseResult<string[], N>>{
//       [name]: {
//         value: values,
//         position: [idx, idx + 1], // flagの位置と、値の位置を返す
//         option
//       }
//     };
//   };
// }
function makeStringArrayFlag2<N extends string>(
  name: N,
  option: FlagOption<string[]>
): StringArrayFlag<N> {
  return (args: string[]) => {
    // defaultは `--name` のように、`--`のprefixがつく
    const flagName = `--${name}`;

    // flagの位置を全てとってくる
    const idxes = args
      .map((a, i) => {
        if (a === flagName) {
          return i;
        }
      })
      .filter(i => i);

    // --name value1 --name value2 --name value3 として値が入っているので、flagの次の位置の値をとってくる
    const values = idxes.map(i => args[i + 1]);
    const position = idxes.map(i => [i, i + 1]).flat();

    // 型キャストしてコンパイラを通す
    return <ParseResult<string[], N>>{
      [name]: {
        value: values,
        position, // flagの位置と、値の位置を返す
        option
      }
    };
  };
}

const booleanFlag = makeBooleanFlag("opts1", {
  usage: "boolean example"
});

//const stringArrayFlag = makeStringArrayFlag("arr", {
//  usage: "custom-flag example"
//});
//
const stringArrayFlag2 = makeStringArrayFlag2("arr2", {
  usage: "custom-flag2 example"
});

const flags = reduceFlag(booleanFlag, stringArrayFlag2);

const command = makeCommand({
  name: "example",
  description: "catacli is typescript-friendly commander tool",
  version: "0.0.1",
  usage: "simple [OPTIONS] arg1",
  flag: flags,
  handler: (_, opts) => {
    console.log("opts1: ", opts.opts1.value); // booleanとして推論される
    console.log("flag arr: ", opts.arr2.value); // string[] として推論される
  }
});

command(process.argv.splice(2));
