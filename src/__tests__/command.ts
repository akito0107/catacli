import { makeCommand } from "../command";
import { makePositionalArguments, makeStringArgument } from "../args";
import { strict as assert } from "assert";

import { composeFlag, makeNumberFlag, makeStringFlag } from "../flag";

test("make command", done => {
  const globalFlag = composeFlag(
    makeStringFlag("arg1"),
    makeNumberFlag("arg2", {
      alias: "a2"
    })
  );
  const positionalArgs = makePositionalArguments(
    makeStringArgument("pos1"),
    makeStringArgument("pos2")
  );
  const command = makeCommand({
    name: "test",
    flag: globalFlag,
    potisionalArguments: positionalArgs,
    handler: (args, flags, rawArgs) => {
      assert.deepEqual(flags, {
        arg1: {
          value: "test",
          option: {},
          position: [0, 1]
        },
        arg2: {
          value: 123,
          option: {
            alias: "a2"
          },
          position: [2, 3]
        },
        help: {
          option: {
            usage: "show help"
          },
          value: undefined
        }
      });
      assert.deepEqual(args, {
        pos1: {
          value: "aaa"
        },
        pos2: {
          value: "bbb"
        }
      });
      assert.deepEqual(rawArgs, ["--arg1", "test", "-a2", "123", "aaa", "bbb"]);
      done();
    }
  });

  command(["--arg1", "test", "-a2", "123", "aaa", "bbb"]);
});
