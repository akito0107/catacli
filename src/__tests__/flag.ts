import { strict as assert } from "assert";
import {
  makeNumberFlag,
  makeStringFlag,
  reduceFlag,
  makeBooleanFlag
} from "../flag";

test("parse number", () => {
  const flag = makeNumberFlag("arg1");
  assert.deepEqual(flag(["--arg1", "123", "--arg2", "hoge"]), {
    arg1: { value: 123, option: {}, position: [0, 1] }
  });
});

test("parse string", () => {
  const flag = makeStringFlag("arg1");
  assert.deepEqual(flag(["--arg1", "123", "--arg2", "hoge"]), {
    arg1: { value: "123", option: {}, position: [0, 1] }
  });
});

test("reduceFlag", () => {
  const flag1 = makeNumberFlag("arg1", { alias: "a" });
  const flag2 = makeStringFlag("arg2");

  const composed = reduceFlag(flag1, flag2);
  const result = composed(["-a", "123", "--arg2", "hoge"]);

  assert.deepEqual(result, {
    arg1: {
      value: 123,
      option: {
        alias: "a"
      },
      position: [0, 1]
    },
    arg2: {
      value: "hoge",
      option: {},
      position: [2, 3]
    }
  });
});

test("compose3", () => {
  const flag1 = makeNumberFlag("arg1");
  const flag2 = makeStringFlag("arg2");
  const flag3 = makeBooleanFlag("arg3");

  const parse = reduceFlag(flag1, flag2, flag3);
  const res = parse(["--arg1", "123", "--arg2", "hoge", "--arg3"]);

  assert.deepEqual(res, {
    arg1: {
      value: 123,
      option: {},
      position: [0, 1]
    },
    arg2: {
      value: "hoge",
      option: {},
      position: [2, 3]
    },
    arg3: {
      value: true,
      option: {},
      position: [4]
    }
  });
});
