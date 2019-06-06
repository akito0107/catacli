import { Args } from "./parser";

type CommandSpec<T> = {
  name?: string;
  flag?: T;
  handler: T extends (args: Args) => infer V ? (v: V) => any : never;
};

export type Runnable = (str: string) => ((args: Args) => void) | false;

export function makeCommand<T>(spec: CommandSpec<T>): Runnable {
  return (name: string) => {
    if (name !== spec.name) {
      return false;
    }
    return (args: Args) => {
      const opts = (<any>spec.flag)(args);
      spec.handler(opts);
    };
  };
}
