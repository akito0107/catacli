import { UnionToIntersection, TupleTypes } from "./flag";

type Argument<N extends string, T> = (v: string) => { [key in N]: T };

type StringArgument<N extends string> = Argument<N, string>;
type BooleanArgument<N extends string> = Argument<N, boolean>;
type NumberArgument<N extends string> = Argument<N, number>;

export type ArgumentOption = {
  usage?: string;
  position?: number;
};

export function makeStringArgument<N extends string>(
  name: N,
  opts: ArgumentOption = {}
): StringArgument<N> {
  return (value: string) => {
    return <any>{ [name]: { value, ...opts } };
  };
}

export function makeBooleanArgument<N extends string>(
  name: N,
  opts: ArgumentOption = {}
): BooleanArgument<N> {
  return (value: string) => {
    if (value === "true") {
      return <any>{ [name]: { value: true, ...opts } };
    } else if (value === "false") {
      return <any>{ [name]: { value: false, ...opts } };
    }
    return <any>{ [name]: { value: undefined, ...opts } };
  };
}

export function makeNumberArgument<N extends string>(
  name: N,
  opts: ArgumentOption = {}
): NumberArgument<N> {
  return (value: string) => {
    const v = parseInt(value, 10);
    return <any>{ [name]: { value: v, ...opts } };
  };
}

export function makePositionalArguments<
  T extends Array<(args: string) => { [key: string]: any }>
>(...argParsers: T): (args: string[]) => UnionToIntersection<TupleTypes<T>> {
  return (args: Array<string | undefined>) => {
    const parseResult = <any>args.reduce((m, arg, idx) => {
      if (!arg || argParsers.length === 0) {
        return m;
      }
      const parser = argParsers[0];
      argParsers.shift();
      const res = parser(arg);
      const v = Object.keys(res).reduce((m, k) => {
        return {
          ...m,
          ...res,
          [k]: {
            ...res[k],
            position: idx
          }
        };
      }, {});
      return {
        ...v,
        ...m
      };
    }, {});

    return parseResult;
  };
}
