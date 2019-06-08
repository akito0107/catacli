export type Flag<T, N extends string> = (args: string[]) => ParseResult<T, N>;

export type ParseResult<T, N extends string> = {
  [key in N]: {
    value?: T;
    option: FlagOption<T>;
    position?: number[];
  }
};

export type NumberFlag<N extends string> = Flag<number, N>;
export type StringFlag<N extends string> = Flag<string, N>;
export type BooleanFlag<N extends string> = Flag<boolean, N>;

export type FlagOption<T> = {
  alias?: string;
  default?: T;
  usage?: string;
};

function findIndex(args: string[], ...names: string[]): number {
  return args.findIndex(a => {
    const result = names.findIndex(n => {
      return a === `--${n}` || a === `-${n}`;
    });
    return result > -1;
  });
}

export function makeNumberFlag<N extends string>(
  name: N,
  option: FlagOption<number> = {}
): NumberFlag<N> {
  return (args: string[]) => {
    const idx = findIndex(args, name, option.alias || "");
    if (idx < 0 || idx + 1 >= args.length) {
      return <any>{
        [name]: {
          value: option.default,
          option
        }
      };
    }
    const v = args[idx + 1];

    return <any>{
      [name]: { value: parseInt(v, 10), option, position: [idx, idx + 1] }
    };
  };
}

export function makeStringFlag<N extends string>(
  name: N,
  option: FlagOption<string> = {}
): StringFlag<N> {
  return (args: string[]) => {
    const idx = findIndex(args, name, option.alias);
    if (idx < 0 || idx + 1 >= args.length) {
      return <any>{
        [name]: {
          value: option.default,
          option
        }
      };
    }
    const v = args[idx + 1];
    return <any>{
      [name]: { value: v, option, position: v ? [idx, idx + 1] : undefined }
    };
  };
}

export function makeBooleanFlag<N extends string>(
  name: N,
  option: FlagOption<boolean> = {}
): BooleanFlag<N> {
  return (args: string[]) => {
    const idx = findIndex(args, name, option.alias);
    if (idx < 0) {
      return <any>{
        [name]: {
          value: option.default,
          option
        }
      };
    }

    return <any>{ [name]: { value: true, option, position: [idx] } };
  };
}

type TupleTypes<T> = { [P in keyof T]: T[P] } extends {
  [key: number]: (args: string[]) => infer V;
}
  ? V
  : never;

type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never;

export function composeFlag<
  T extends Array<(args: string[]) => { [key: string]: any }>
>(...src: T): (args: string[]) => UnionToIntersection<TupleTypes<T>> {
  return <any>src.splice(1).reduce((acc, cur) => {
    return _compose(acc, cur);
  }, src[0]);
}

function _compose<T1, T1Name extends string, T2, T2Name extends string>(
  t1: Flag<T1, T1Name>,
  t2: Flag<T2, T2Name>
): Flag<{ [key in T1Name]: T1 } & { [key in T2Name]: T2 }, T1Name | T2Name> {
  return (args: string[]) => {
    const t1v = t1(args);
    const t2v = t2(args);
    return <any>{
      ...t1v,
      ...t2v
    };
  };
}
