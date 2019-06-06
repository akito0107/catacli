import { Runnable } from "./command";
import { parse } from "./parser";

export function run(name: string, args: string[], ...commands: Runnable[]) {
  if (commands.length === 1) {
    const opts = parse(args);
    const command = commands[0];
    const runnable = command(name);
    if (!runnable) {
      throw new Error(
        `unknown command ${name}: use same name with CommandSpec`
      );
    }
    runnable(opts);
    return;
  }
}
