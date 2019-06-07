import { Runnable } from "./command";

export type Args = { [key in string]: string };

export function parse(
  args: string[],
  runnableMap: { [key in string]: Runnable }
): { opts: Args; runnable: Runnable } {
  const result = {};

  const checkSubcommand = Object.keys(runnableMap).length !== 1;
  let runnable = checkSubcommand
    ? null
    : runnableMap[Object.keys(runnableMap)[0]];

  for (let i = 0; i < args.length; i++) {
    if (maybeFlag(args[i])) {
      if (i + 1 < args.length) {
        result[args[i].slice(2)] = maybeFlagLike(args[i + 1])
          ? "true"
          : args[i + 1];
        continue;
      }
      result[args[i].slice(2)] = "true";
    } else if (maybeAlias(args[i])) {
      if (i + 1 < args.length) {
        result[args[i].slice(1)] = maybeFlagLike(args[i + 1])
          ? "true"
          : args[i + 1];
        continue;
      }
      result[args[i].slice(1)] = "true";
    } else if (checkSubcommand) {
      const subcommand = runnableMap[args[i]];
      if (!subcommand || i === 0) {
        continue;
      }
      runnable = subcommand;
      if (maybeFlag(args[i - 1])) {
        result[args[i - 1].slice(2)] = "true";
      } else if (maybeAlias(args[i - 1])) {
        result[args[i - 1].slice(1)] = "true";
      }
    }
  }

  return { opts: result, runnable };
}

function maybeFlagLike(str: string) {
  return maybeFlag(str) || maybeAlias(str);
}

function maybeFlag(str: string) {
  return str.startsWith("--");
}

function maybeAlias(str: string) {
  return str.startsWith("-");
}
