import { reduceFlag, makeBooleanFlag } from "./flag";
import { defaultHelp } from "./help";
import { makeStringArgument } from "./args";

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
  positionalArguments?: P;
  handler?: F extends (args: string[]) => infer V
    ? P extends (args: string[]) => infer U
      ? (
          args: U,
          flags: V,
          helpFn?: Function,
          metaInfo?: { spec?: CommandSpec<N, F, P>; rawArgs?: string[] }
        ) => any
      : never
    : never;
};

export type Command = (
  args: string[],
  parentOpts?: {
    commandNamePosition?: number;
    spec?: CommandSpec<any, any, any>;
  }
) => any;

const defaultHelpFlag = makeBooleanFlag("help", {
  usage: "show help"
});

export const makeSubCommandNameArgument = (...names: string[]) =>
  makeStringArgument("COMMAND_NAME", {
    usage: `[${names.join(" | ")}]`
  });

export function makeCommand<
  N extends string,
  T extends (args: string[]) => any,
  P extends (args: string[]) => any
>(spec: CommandSpec<N, T, P>, showHelp = defaultHelp): Command {
  return (args: string[], parentSpec) => {
    const parser = showHelp
      ? reduceFlag(defaultHelpFlag, spec.flag)
      : spec.flag;
    const flags = parser(args);

    const used = Object.keys(flags)
      .map(k => {
        return flags[k].position;
      })
      .filter(o => o)
      .flat();

    const rest = args.map((a, idx) => {
      if (parentSpec) {
        if (used.indexOf(idx) === -1 && idx > parentSpec.commandNamePosition) {
          return a;
        }
      } else {
        if (used.indexOf(idx) === -1) {
          return a;
        }
      }
    });
    const helpFn = (message = "") =>
      showHelp(spec, positionalArguments, flags, message, parentSpec);

    const positionalArguments = spec.positionalArguments
      ? spec.positionalArguments(rest)
      : {};

    const isUnknownArgs = Object.keys(positionalArguments).some(k => {
      return !positionalArguments[k].value;
    });

    if (isUnknownArgs) {
      helpFn();
      return;
    }

    const nameIdx = positionalArguments["COMMAND_NAME"]
      ? positionalArguments["COMMAND_NAME"].position
      : Number.MAX_SAFE_INTEGER;

    if (flags.help && flags.help.value && nameIdx > flags.help.position[0]) {
      helpFn();
      return;
    }

    return spec.handler(positionalArguments, flags, helpFn, {
      spec,
      rawArgs: args
    });
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
  const handler = (args, _, helpFn, { spec, rawArgs }) => {
    const subCommand = args["COMMAND_NAME"];
    if (!subCommand) {
      helpFn();
      return;
    }
    const command = commandMap[subCommand.value];
    if (!command) {
      helpFn();
      return;
    }

    command(rawArgs, {
      commandNamePosition: subCommand.position[0],
      spec
    });
  };

  return handler;
}
