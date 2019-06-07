import { Args } from "./parser";

export type CommandSpec<T> = {
  name?: string;
  flag?: T;
  handler: T extends (args: Args) => infer V ? (v: V) => any : never;
};

export type Runnable = (args: Args) => void;
export type Command = { name: string; run: Runnable };

export function makeCommand<T>(spec: CommandSpec<T>): Command {
  return {
    name: spec.name,
    run: (args: Args) => {
      const opts = (<any>spec.flag)(args);
      spec.handler(opts);
    }
  };
}
