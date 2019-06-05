import { strict as assert } from "assert";

type Args = { [key in string]: string };

type Flag<T, N extends string> = (name: N) => (args: Args) => { [symbol]: T };

function makeNumberFlagParser<N extends string>(): Flag<number, N> {
  return (name: N) => args => {
    const v = args[name];
    return parseInt(v, 10);
  };
}
test("parser", () => {
  const arg1PreParser = makeNumberFlagParser<"arg1">();
  const parser = arg1PreParser("arg1");
  assert.deepEqual(parser({ arg1: "123", arg2: "hoge" }), 123);
});
