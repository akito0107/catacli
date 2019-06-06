import { Args } from "./parser";

type CommandSpec<T> = {
  name?: string;
  flag: T;
  handler: T extends (args: Args) => infer V ? (v: V) => any : never;
};

export function makeCommand<T>(spec: CommandSpec<T>) {
  return (name: string, args: Args) => {
    if (name !== spec.name) {
      return false;
    }
    const opts = (<any>spec.flag)(args);
    spec.handler(opts);
    return true;
  };
}
