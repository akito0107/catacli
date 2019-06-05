import { Args } from "./parser";

export type Flag<T, N extends string> = (args: Args) => { [key in N]: T };
export type NumberFlag<N extends string> = Flag<number, N>;
export type StringFlag<N extends string> = Flag<string, N>;
export type BooleanFlag<N extends string> = Flag<boolean, N>;

export function makeNumberFlag<N extends string>(name: N): NumberFlag<N> {
  return (args: Args) => {
    const v = args[name];
    return <any>{ [name]: parseInt(v, 10) };
  };
}

export function makeStringFlag<N extends string>(name: N): StringFlag<N> {
  return (args: Args) => {
    const v = args[name];
    return <any>{ [name]: v };
  };
}

export function makeBooleanFlag<N extends string>(name: N): BooleanFlag<N> {
  return (args: Args) => {
    if (args[name]) {
      return <any>{ [name]: true };
    }
    return <any>{ [name]: false };
  };
}

export function compose<T1, T1Name extends string, T2, T2Name extends string>(
  t1: Flag<T1, T1Name>,
  t2: Flag<T2, T2Name>
): Flag<{ [key in T1Name]: T1 } & { [key in T2Name]: T2 }, T1Name | T2Name> {
  return (args: Args) => {
    const t1v = t1(args);
    const t2v = t2(args);
    return <any>{
      ...t1v,
      ...t2v
    };
  };
}
