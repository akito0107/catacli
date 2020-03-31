export type Opts<T> = {
  [k: string]: {
    value?: T;
    option: any;
    position?: number | number[];
  };
};
