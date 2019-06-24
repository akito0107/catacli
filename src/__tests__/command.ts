import {
  makeCommand,
  makeSubCommandHandler,
  makeSubCommandNameArgument
} from "../command";
import { makePositionalArguments, makeStringArgument } from "../args";
import { strict as assert } from "assert";

import {
  reduceFlag,
  makeBooleanFlag,
  makeNumberFlag,
  makeStringFlag
} from "../flag";

test("make command", done => {
  const globalFlag = reduceFlag(
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
    positionalArguments: positionalArgs,
    handler: (args, flags) => {
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
          value: "aaa",
          position: [4]
        },
        pos2: {
          value: "bbb",
          position: [5]
        }
      });
      done();
    }
  });

  command(["--arg1", "test", "-a2", "123", "aaa", "bbb"]);
});

test("sub command", done => {
  const globalFlag = reduceFlag(
    makeStringFlag("arg1"),
    makeNumberFlag("arg2", {
      alias: "a2"
    })
  );
  const positionalArgs = makePositionalArguments(
    makeSubCommandNameArgument("sub1")
  );
  const localFlag = reduceFlag(globalFlag, makeBooleanFlag("sub1"));

  const subArgs = makePositionalArguments(makeStringArgument("sub1arg"));

  const sub1 = makeCommand({
    name: "sub1",
    flag: localFlag,
    positionalArguments: subArgs,
    handler: (args, flags) => {
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
        sub1: {
          value: true,
          option: {},
          position: [5]
        },
        help: {
          option: {
            usage: "show help"
          },
          value: undefined
        }
      });
      assert.deepEqual(args, {
        sub1arg: {
          value: "test",
          position: [6]
        }
      });
      done();
    }
  });
  const command = makeCommand({
    name: "test",
    flag: globalFlag,
    positionalArguments: positionalArgs,
    handler: makeSubCommandHandler({ name: "sub1", command: sub1 })
  });

  command(["--arg1", "test", "-a2", "123", "sub1", "--sub1", "test"]);
});
