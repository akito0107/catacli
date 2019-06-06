export type Args = { [key in string]: string };

export function parse(args: string[]): Args {
  const result = {};
  const maybeCommand = [];

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
    } else {
      maybeCommand.push(args[i]);
    }
  }

  return result;
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
