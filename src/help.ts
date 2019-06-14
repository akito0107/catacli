import { CommandSpec } from "./command";
import { Opts } from "./types";

const headerString = (spec: CommandSpec<string, any, any>, parentSpec) => {
  const nameString = parentSpec ? `${parentSpec.spec.name} ${spec.name}` : spec.name
  return `
NAME:
   ${nameString} - ${spec.description || ""}

USAGE:
   ${spec.usage || ""}

VERSION:
  ${spec.version || ""}
  
`;
};

const flagsString = (opts, isSub = false) => {
  const initString = isSub ? "SUB OPTIONS:\n" : "OPTIONS:\n";
  return Object.keys(opts).reduce((acc, k) => {
    const aliasStr = opts[k].option.alias ? `, -${opts[k].option.alias}` : "";
    const defaultStr =
      opts[k].option.default != null
        ? `\tdefault=${opts[k].option.default}`
        : "";

    acc += `\t--${k}${aliasStr}  \t ${opts[k].option.usage ||
      ""}${defaultStr}\n`;
    return acc;
  }, initString);
};

const argumentsString = args => {
  const sortedArgs = Object.keys(args)
    .map(a => {
      return { [a]: args[a] };
    })
    .sort((a, b) => {
      const ak = Object.keys(a)[0];
      const bk = Object.keys(b)[0];
      return a[ak].postion - b[bk].position;
    });

  return sortedArgs.reduce((acc, arg) => {
    const key = Object.keys(arg)[0];
    acc += `\t ${key} \t ${arg[key].usage || ""}\n`;
    return acc;
  }, "ARGUMENTS:\n");
};

export type HelpFunction = (
  spec: CommandSpec<any, any, any>,
  args: Opts<any>,
  flags: Opts<any>,
  message?: string,
  parentSpec?: {
    currentPosition?: number;
    spec?: CommandSpec<string, any, any>;
  }
) => string;

export const defaultHelp: HelpFunction = (
  spec,
  args,
  flags,
  message,
  parentSpec
) => {
  let helpstr = headerString(spec, parentSpec);
  if (args) {
    helpstr += argumentsString(args) + "\n";
  }

  if (parentSpec && flags) {
    const parentFlags = Object.keys(parentSpec.spec.flag([]));

    const partitionedFlags = Object.keys(flags).reduce(
      (m, c) => {
        if (parentFlags.includes(c)) {
          m.parent = {
            [c]: {
              ...flags[c]
            },
            ...m.parent
          };
        } else {
          m.sub = {
            [c]: {
              ...flags[c]
            },
            ...m.sub
          };
        }

        return m;
      },
      {
        parent: {},
        sub: {}
      }
    );
    helpstr += flagsString(partitionedFlags.parent);
    helpstr += "\n";
    helpstr += flagsString(partitionedFlags.sub, true);
  } else if (flags) {
    helpstr += flagsString(flags);
  }
  if (message !== "") {
    process.stdout.write(message + "\n");
  }
  process.stdout.write(helpstr);

  return helpstr;
};
