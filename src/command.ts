import { composeFlag, makeBooleanFlag } from "./flag";
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
  potisionalArguments?: P;
  handler?: F extends (args: string[]) => infer V
    ? P extends (args: string[]) => infer U
      ? (args: U, flags: V, helpFn?: Function, rawArgs?: string[]) => any
      : never
    : never;
};

export type Command = (args: string[]) => any;

const defaultHelpFlag = makeBooleanFlag("help", {
  usage: "show help"
});

export const subCommandNameArgument = (...names: string[]) =>
  makeStringArgument("COMMAND_NAME", {
    usage: `[${names.join(" | ")}]`
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

    const nameIdx = positionalArguments["COMMAND_NAME"]
      ? args.indexOf(positionalArguments["COMMAND_NAME"].value)
      : Number.MAX_SAFE_INTEGER;

    const helpFn = () => showHelp(spec, positionalArguments, flags, args);

    if (flags.help && flags.help.value && nameIdx > flags.help.position[0]) {
      helpFn();
      return;
    }

    return spec.handler(positionalArguments, flags, helpFn, args);
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
  const handler = (args, flags, helpFn, rawArgs) => {
    const commandName = args["COMMAND_NAME"];
    if (!commandName) {
      helpFn();
      return;
    }
    const command = commandMap[commandName.value];
    if (!command) {
      helpFn();
      return;
    }

    if (flags.help && flags.help.value) {
    }

    rawArgs.splice(commandName.position, 1);
    command(rawArgs);
  };

  return handler;
}
