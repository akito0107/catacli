import {
  composeFlag,
  makeBooleanFlag,
  TupleTypes,
  UnionToIntersection
} from "./flag";

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
      ? (v: V, rawArgs?: string[]) => any
      : never
    : never;
};

export type Command = (args: string[]) => any;

export function makePositionalArguments<
  T extends Array<(args: string[]) => { [key: string]: any }>
>(...args: T): (args: string[]) => UnionToIntersection<TupleTypes<T>> {
  return <any>{};
}

const defaultHelpFlag = makeBooleanFlag("help", {
  usage: "show help"
});

export function makeCommand<
  T extends (args: string[]) => any,
  P extends (args: string[]) => any
>(spec: CommandSpec<T, P>, showHelp = defaultHelp): Command {
  return (args: string[]) => {
    const parser = composeFlag(defaultHelpFlag, spec.flag);
    const opts = parser(args);
    if ((<any>opts).help.value) {
      showHelp(spec, opts);
      return;
    }

    return spec.handler(opts, args);
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

function defaultHelp(spec, opts) {
  const helpstr = helpString(spec) + optionsString(opts);
  process.stdout.write(helpstr);
}
