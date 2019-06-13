import { composeFlag, makeBooleanFlag } from "./flag";
import { defaultHelp } from "./help";

export type CommandSpec<
  N extends string,
  F extends (args: string[]) => any,
  P extends (args: string[]) => any
> = {
  name: N;
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
  N extends string,
  T extends (args: string[]) => any,
  P extends (args: string[]) => any
>(spec: CommandSpec<N, T, P>, showHelp = defaultHelp): Command {
  return (args: string[]) => {
    const parser = showHelp
      ? composeFlag(defaultHelpFlag, spec.flag)
      : spec.flag;
    const flags = parser(args);

    const used = Object.keys(flags)
      .map(k => {
        return flags[k].position;
      })
      .filter(o => o)
      .flat();

    const rest = args.filter((_, idx) => {
      return used.indexOf(idx) === -1;
    });

    const positionalArguments = spec.potisionalArguments
      ? spec.potisionalArguments(rest)
      : {};

    if (flags.help && flags.help.value) {
      showHelp(spec, positionalArguments, flags);
      return;
    }

    return spec.handler(positionalArguments, flags, args);
  };
}

export function makeSubCommandHandler(
  ...commands: { name: string; command: Command }[]
) {
  const commandMap = commands.reduce((acc, c) => {
    return {
      ...acc,
      [c.name]: c.command
    };
  }, {});

  return (_, flags, rawArgs) => {
    const used = Object.keys(flags)
      .map(k => {
        return flags[k].position;
      })
      .filter(o => o)
      .flat();

    const rest = rawArgs.filter((_, idx) => {
      return used.indexOf(idx) === -1;
    });
    if (rest.length === 0) {
      // TODO subcommand help
      return;
    }
    const command = commandMap[rest[0]];
    if (!command) {
      // TODO subcommand help
      throw new Error(rest);
    }

    rawArgs.splice(rawArgs.indexOf(rest[0]), 1);
    command(rawArgs);
  };
}
