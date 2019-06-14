import {
  makeBooleanArgument,
  makeNumberArgument,
  makePositionalArguments,
  makeStringArgument
} from "../args";
import { strict as assert } from "assert";

describe("makePositionalArguments", () => {
  const parse = makePositionalArguments(
    makeStringArgument("arg1"),
    makeBooleanArgument("arg2"),
    makeNumberArgument("arg3")
  );

  it("no unused args", done => {
    const res = parse([undefined, "arg1", "true", undefined, "123"]);

    assert.deepEqual(res, {
      arg1: {
        value: "arg1",
        position: [1]
      },
      arg2: {
        value: true,
        position: [2]
      },
      arg3: {
        value: 123,
        position: [4]
      }
    });
    done();
  });

  it("more args", done => {
    const res = parse([undefined, "arg1", "true", "123", "unknown"]);

    assert.deepEqual(res, {
      arg1: {
        value: "arg1",
        position: [1]
      },
      arg2: {
        value: true,
        position: [2]
      },
      arg3: {
        value: 123,
        position: [3]
      }
    });
    done();
  });

  it("less args", done => {
    const res = parse([undefined, "arg1", "true", undefined]);

    assert.deepEqual(res, {
      arg1: {
        value: undefined,
        position: [0]
      },
      arg2: {
        value: undefined,
        position: [1]
      },
      arg3: {
        value: undefined,
        position: [2]
      }
    });
    done();
  });
});
