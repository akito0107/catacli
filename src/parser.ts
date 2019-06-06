export type Args = { [key in string]: string };

export function makeParser(args: string[]) {
  return new Parser(args);
}

class Parser {
  private readonly args: string[];
  private idx: number;

  constructor(args: string[]) {
    this.args = args;
    this.idx = 0;
  }
  peek() {
    if (this.args.length <= this.idx + 1) {
      return null;
    }
    return this.args[this.idx + 1];
  }
  next() {
    if (this.args.length <= this.idx + 1) {
      return null;
    }
    this.idx += 1;
    return this.args[this.idx];
  }
  consumeFlag() {
    const tok = this.peek();
    if (!tok) {
      return null;
    }
    if (maybeFlag(tok)) {
      this.next();
      return tok.slice(2);
    }
    if (maybeAlias(tok)) {
      this.next();
      return tok.slice(1);
    }
    return null;
  }
  consumeValue() {
    const tok = this.peek();
    if (!tok) {
      return null;
    }
    if (maybeFlagLike(tok)) {
      return null;
    }
    return this.next();
  }
}

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
