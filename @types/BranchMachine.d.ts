type Transition<T, K> = (input: T, event: K, computed: { [key: string]: any }) => T;

type BranchMachine<T, K, Switch> = {
  eval: (input: T) => Switch;
  description?: string;
  compute?: (input: T, event: K) => { [key: string]: any }
  on: {
    value: Switch | ((switchValue: Switch, input: T) => boolean);
    description?: string;
    log?: (state?: T) => string;
    do: Transition<T, K> | BranchMachine<T, K, any>;
  }[];
  default?: Transition<T, K> | BranchMachine<T, K, any>
};
