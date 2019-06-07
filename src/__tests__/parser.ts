import { strict as assert } from "assert";
import { parse } from "../parser";

test("parse with alias", () => {
  assert.deepEqual(parse(["--arg1", "test", "-a1", "test2"], {}), {
    runnable: null,
    opts: {
      arg1: "test",
      a1: "test2"
    }
  });
});

test("parse with boolean flag", () => {
  assert.deepEqual(parse(["--arg1", "--arg2", "--arg3", "test"], {}), {
    runnable: null,
    opts: {
      arg1: "true",
      arg2: "true",
      arg3: "test"
    }
  });
});
