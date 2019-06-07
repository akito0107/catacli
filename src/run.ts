import { Command } from "./command";
import { parse } from "./parser";

export function run(args: string[], ...commands: Command[]) {
  const runnableMap = commands.reduce((m, c) => {
    m[c.name] = c.run;
    return m;
  }, {});
  const { opts, runnable } = parse(args, runnableMap);
  runnable(opts);
}
