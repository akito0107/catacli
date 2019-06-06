import { strict as assert } from "assert";
import { makeCommand } from "../command";
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

  command("test", { arg1: "test", arg2: "123" });
});
