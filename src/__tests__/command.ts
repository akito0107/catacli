import { makeCommand, makePositionalArguments } from "../command";
import { strict as assert } from "assert";

import { composeFlag, makeNumberFlag, makeStringFlag } from "../flag";
import { openSync } from "fs";

test("make command", done => {
  const globalFlag = composeFlag(
    makeStringFlag("arg1"),
    makeNumberFlag("arg2", {
      alias: "a2"
    })
  );
  const command = makeCommand({
    name: "test",
    flag: globalFlag,
    potisionalArguments: makePositionalArguments(
      makeStringFlag("pos1"),
      makeStringFlag("pos2")
    ),
    handler: (opts, args) => {
      assert.deepEqual(opts, {
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
      assert.deepEqual(args, ["--arg1", "test", "-a2", "123"]);
      done();
    }
  });

  command(["--arg1", "test", "-a2", "123"]);
});
