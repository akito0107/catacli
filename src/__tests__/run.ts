import { strict as assert } from "assert";
import { makeCommand } from "../command";
import { run } from "../run";
import { composeFlag, makeNumberFlag, makeStringFlag } from "../flag";

test("makeCommand", done => {
  const flag = composeFlag(makeStringFlag("arg1"), makeNumberFlag("arg2"));

  const command = makeCommand({
    name: "test",
    flag,
    handler: opts => {
      assert.deepEqual(opts, {
        arg1: "test",
        arg2: 123
      });
      done();
    }
  });

  run("test", ["--arg1", "test", "--arg2", "123"], command);
});
