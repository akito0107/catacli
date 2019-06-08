import { Args } from "./parser";

export type CommandSpec<T extends (params: Args) => any> = {
  name?: string;
  flag?: T;
  handler?: T extends (params: Args) => infer V ? (v: V) => any : never;
};

export type Command = (args: string[]) => any;

export function makeCommand<T extends (args: Args) => any>(
  spec: CommandSpec<T>
): Command {
  return (args: string[]) => {
    const opts = spec.flag(args);
    return spec.handler(opts);
  };
}
