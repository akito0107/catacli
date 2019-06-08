export type CommandSpec<T extends (args: string[]) => any> = {
  name?: string;
  description?: string;
  flag?: T;
  handler?: T extends (args: string[]) => infer V
    ? (v: V, args?: string[]) => any
    : never;
};

export type Command = (args: string[]) => any;

export function makeCommand<T extends (args: string[]) => any>(
  spec: CommandSpec<T>
): Command {
  return (args: string[]) => {
    const opts = spec.flag(args);
    return spec.handler(opts, args);
  };
}
