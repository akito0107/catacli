import { CommandSpec } from "./command";

const helpString = (spec: CommandSpec<string, any, any>) => `
NAME:
   ${spec.name} - ${spec.description || ""}

USAGE:
   ${spec.usage || ""}

VERSION:
  ${spec.version || ""}
  
`;

const optionsString = opts => {
  return Object.keys(opts).reduce((acc, k) => {
    const aliasStr = opts[k].option.alias ? `, -${opts[k].option.alias}` : "";
    const defaultStr =
      opts[k].option.default != null
        ? `\tdefault=${opts[k].option.default}`
        : "";

    acc += `\t--${k}${aliasStr}  \t ${opts[k].option.usage ||
      ""}${defaultStr}\n`;
    return acc;
  }, "OPTIONS:\n");
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

export function defaultHelp(spec, args, flags, _) {
  let helpstr = helpString(spec);
  if (args) {
    helpstr += argumentsString(args) + "\n";
  }
  if (flags) {
    helpstr += optionsString(flags);
  }
  process.stdout.write(helpstr);
}
