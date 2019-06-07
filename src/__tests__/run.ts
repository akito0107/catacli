import { strict as assert } from "assert";
import { makeCommand } from "../command";
import { run } from "../run";
import { composeFlag, makeNumberFlag, makeStringFlag } from "../flag";

test("single command", done => {
  const flag = composeFlag(makeStringFlag("arg1"), makeNumberFlag("arg2"));

  const command = makeCommand({
    name: "test",
    flag,
    handler: opts => {
      assert.deepEqual(opts, {
        arg1: { value: "test", option: {} },
        arg2: { value: 123, option: {} }
      });
      done();
    }
  });

  run(["--arg1", "test", "--arg2", "123"], command);
});

test("sub command", done => {
  const globalFlag = composeFlag(
    makeStringFlag("arg1"),
    makeNumberFlag("arg2")
  );
  const flag1 = composeFlag(globalFlag, makeStringFlag("arg3"));
  const flag2 = composeFlag(globalFlag, makeStringFlag("arg4"));

  const command1 = makeCommand({
    name: "command1",
    flag: flag1,
    handler: opts => {
      assert.fail("must not be called");
      done(opts);
    }
  });

  const command2 = makeCommand({
    name: "command2",
    flag: flag2,
    handler: opts => {
      assert.deepEqual(opts, {
        arg1: { value: "test", option: {} },
        arg2: { value: 123, option: {} },
        arg4: { value: "arg4", option: {} }
      });
      done();
    }
  });

  run(
    ["--arg1", "test", "--arg2", "123", "command2", "--arg4", "arg4"],
    command1,
    command2
  );
});
