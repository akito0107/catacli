import { UnionToIntersection, TupleTypes } from "./flag";

type Argument<N extends string, T> = (
  v: string[]
) => { [key in N]: { value: T; position: number[]; usage: string } };

type StringArgument<N extends string> = Argument<N, string>;
type BooleanArgument<N extends string> = Argument<N, boolean>;
type NumberArgument<N extends string> = Argument<N, number>;

export type ArgumentOption = {
  usage?: string;
};

export function makeStringArgument<N extends string>(
  name: N,
  opts: ArgumentOption = {}
): StringArgument<N> {
  return (values: string[]) => {
    let value = "";
    let i;
    for (i = 0; i < values.length; i++) {
      if (values[i]) {
        value = values[i];
        break;
      }
    }
    if (value === "") {
      return <any>{ [name]: { value: undefined, ...opts, position: [] } };
    }
    return <any>{ [name]: { value, ...opts, position: [i] } };
  };
}

export function makeBooleanArgument<N extends string>(
  name: N,
  opts: ArgumentOption = {}
): BooleanArgument<N> {
  return (values: string[]) => {
    let value = "";
    let i;
    for (i = 0; i < values.length; i++) {
      if (values[i]) {
        value = values[i];
        break;
      }
    }

    if (value === "true") {
      return <any>{ [name]: { value: true, ...opts, position: [i] } };
    } else if (value === "false") {
      return <any>{ [name]: { value: false, ...opts, position: [i] } };
    }
    return <any>{ [name]: { value: undefined, ...opts, position: [] } };
  };
}

export function makeNumberArgument<N extends string>(
  name: N,
  opts: ArgumentOption = {}
): NumberArgument<N> {
  return (values: string[]) => {
    let value = "";
    let i;
    for (i = 0; i < values.length; i++) {
      if (values[i]) {
        value = values[i];
        break;
      }
    }
    const v = parseInt(value, 10);
    return <any>{
      [name]: { value: isNaN(v) ? undefined : v, ...opts, position: [i] }
    };
  };
}

export function makePositionalArguments<
  T extends Array<(args: string[]) => { [key: string]: any }>
>(...argParsers: T): (args: string[]) => UnionToIntersection<TupleTypes<T>> {
  return (args: Array<string | undefined>) => {
    const parsers = [...argParsers];
    const validArgLength = args.filter(a => a).length;

    if (validArgLength < parsers.length) {
      return parsers.reduce((m, parser, idx) => {
        const res = parser([]);
        const v = Object.keys(res).reduce((m, k) => {
          return {
            ...m,
            ...res,
            [k]: {
              ...res[k],
              position: [idx]
            }
          };
        }, {});
        return {
          ...v,
          ...m
        };
      }, {});
    }

    const rest = [...args];

    return <any>args.reduce((m, arg) => {
      if (!arg) {
        return m;
      }

      if (parsers.length === 0) {
        return m;
      }

      const parser = parsers[0];
      parsers.shift();
      const res = parser(rest);

      const v = Object.keys(res).reduce((m, k) => {
        res[k].position.forEach(r => {
          rest[r] = undefined;
        });

        return {
          ...m,
          ...res,
          [k]: {
            ...res[k]
          }
        };
      }, {});
      return {
        ...v,
        ...m
      };
    }, {});
  };
}
