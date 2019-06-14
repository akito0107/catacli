
export type Opts<T> = {
  [key in string]: {
    value: T;
    option: any;
    position: number | number[];
  }
};