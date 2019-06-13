import { composeFlag, makeBooleanFlag } from "./flag";

export type CommandSpec<
  F extends (args: string[]) => any,
  P extends (args: string[]) => any
> = {
  name: string;
  description?: string;
  version?: string;
  usage?: string;
  flag?: F;
  potisionalArguments?: P;
  handler?: F extends (args: string[]) => infer V
    ? P extends (args: string[]) => infer U
      ? (args: U, flags: V, rawArgs?: string[]) => any
      : never
    : never;
};

export type Command = (args: string[]) => any;

const defaultHelpFlag = makeBooleanFlag("help", {
  usage: "show help"
});

export function makeCommand<
  T extends (args: string[]) => any,
  P extends (args: string[]) => any
>(spec: CommandSpec<T, P>, showHelp = defaultHelp): Command {
  return (args: string[]) => {
    const parser = showHelp
      ? composeFlag(defaultHelpFlag, spec.flag)
      : spec.flag;
    const opts = parser(args);

    const used = Object.keys(opts)
      .map(k => {
        return opts[k].position;
      })
      .filter(o => o)
      .flat();

    const rest = args.filter((_, idx) => {
      return used.indexOf(idx) === -1;
    });

    const positionalArguments = spec.potisionalArguments
      ? spec.potisionalArguments(rest)
      : {};

    if (opts.help && opts.help.value) {
      showHelp(spec, positionalArguments, opts);
      return;
    }

    return spec.handler(positionalArguments, opts, args);
  };
}

const helpString = (spec: CommandSpec<any, any>) => `
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
      return args[a];
    })
    .sort((a, b) => {
      const ak = Object.keys(a)[0];
      const bk = Object.keys(b)[0];
      return a[ak].postion - b[bk].position;
    });
  return sortedArgs.reduce((acc, arg) => {
    const key = Object.keys(arg)[0];
    acc += `\t ${key} \t ${arg[key].usage}\n`;
    return acc;
  }, "ARGUMENTS:\n");
};

function defaultHelp(spec, args, flags) {
  let helpstr = helpString(spec);
  if (args) {
    helpstr += argumentsString(args);
  }
  if (flags) {
    helpstr += optionsString(flags);
  }
  process.stdout.write(helpstr);
}
