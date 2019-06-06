import { Args } from "./parser";

export type Flag<T, N extends string> = (args: Args) => { [key in N]: T };
export type NumberFlag<N extends string> = Flag<number, N>;
export type StringFlag<N extends string> = Flag<string, N>;
export type BooleanFlag<N extends string> = Flag<boolean, N>;

export type FlagOption<T> = {
  alias?: string;
  default?: T;
  usage?: string;
};

export function makeNumberFlag<N extends string>(
  name: N,
  option: FlagOption<number> = {}
): NumberFlag<N> {
  return (args: Args) => {
    let v = args[name];
    if (!v && option.alias) {
      v = args[option.alias];
    }

    if (!v) {
      return <any>{ [name]: option.default };
    }

    return <any>{ [name]: parseInt(v, 10) };
  };
}

export function makeStringFlag<N extends string>(
  name: N,
  option: FlagOption<string> = {}
): StringFlag<N> {
  return (args: Args) => {
    const v = args[name];
    if (!v && option.alias) {
      return <any>{ [name]: args[option.alias] };
    }
    if (!v) {
      return <any>{ [name]: option.default };
    }
    return <any>{ [name]: v };
  };
}

export function makeBooleanFlag<N extends string>(
  name: N,
  option: FlagOption<boolean> = {}
): BooleanFlag<N> {
  return (args: Args) => {
    if (args[name]) {
      return <any>{ [name]: true };
    }
    const v = args[name];
    if (!v && option.alias) {
      return <any>{ [name]: args[option.alias] };
    }
    if (v == null && option.default) {
      return <any>{ [name]: true };
    }
    return <any>{ [name]: false };
  };
}

type TupleTypes<T> = { [P in keyof T]: T[P] } extends {
  [key: number]: (args: Args) => infer V;
}
  ? V
  : never;

type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never;

export function compose<
  T extends Array<(args: Args) => { [key: string]: any }>
>(...src: T): (args: Args) => UnionToIntersection<TupleTypes<T>> {
  return <any>src.splice(1).reduce((acc, cur) => {
    return compose2(acc, cur);
  }, src[0]);
}

function compose2<T1, T1Name extends string, T2, T2Name extends string>(
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
