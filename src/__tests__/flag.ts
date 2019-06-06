import { strict as assert } from "assert";
import {
  makeNumberFlag,
  makeStringFlag,
  composeFlag,
  makeBooleanFlag
} from "../flag";

test("parse number", () => {
  const flag = makeNumberFlag("arg1");
  assert.deepEqual(flag({ arg1: "123", arg2: "hoge" }), { arg1: 123 });
});

test("parse string", () => {
  const flag = makeStringFlag("arg1");
  assert.deepEqual(flag({ arg1: "123", arg2: "hoge" }), { arg1: "123" });
});

test("composeFlag", () => {
  const flag1 = makeNumberFlag("arg1", { alias: "a" });
  const flag2 = makeStringFlag("arg2");

  const composed = composeFlag(
    flag1,
    flag2
  );
  const result = composed({ a: "123", arg2: "hoge" });

  assert.deepEqual(result, {
    arg1: 123,
    arg2: "hoge"
  });
});

test("compose3", () => {
  const flag1 = makeNumberFlag("arg1");
  const flag2 = makeStringFlag("arg2");
  const flag3 = makeBooleanFlag("arg3");

  const parse = composeFlag(
    flag1,
    flag2,
    flag3
  );
  const res = parse({ arg1: "123", arg2: "hoge", arg3: "true" });

  assert.deepEqual(res, {
    arg1: 123,
    arg2: "hoge",
    arg3: true
  });
});
