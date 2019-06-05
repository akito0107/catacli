import { strict as assert } from "assert";
import { makeNumberFlag, makeStringFlag, compose } from "../flag";

test("parse number", () => {
  const flag = makeNumberFlag("arg1");
  assert.deepEqual(flag({ arg1: "123", arg2: "hoge" }), { arg1: 123 });
});

test("parse string", () => {
  const flag = makeStringFlag("arg1");
  assert.deepEqual(flag({ arg1: "123", arg2: "hoge" }), { arg1: "123" });
});

test("compose", () => {
  const flag1 = makeNumberFlag("arg1", "a");
  const flag2 = makeStringFlag("arg2");

  const composed = compose(
    flag1,
    flag2
  );
  const result = composed({ arg1: "123", arg2: "hoge" });

  assert.deepEqual(result, {
    arg1: 123,
    arg2: "hoge"
  });
});
