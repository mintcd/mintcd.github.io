import { State } from "@node_modules/@dnd-kit/core/dist/store";

type Factory<T extends object> = {
  [key in keyof T]: T[key];
} & {
  get: () => T
  set: (key: keyof T, value: T[key]) => void;
};

type ComponentAction = 'change' | 'submit'

type DefaultComponentProps<T> = {
  className?: string;
  style?: React.CSSProperties;
  state: T;
  render?: (partialState: Partial<T>) => React.ReactElement;
  useComponentDispatch?: (partialState: Partial<T>, action: 'change' | 'submit') => void;
  listeners?: Listeners
};

type Listeners<T extends HTMLElement = HTMLElement> = {
  onClick?: React.MouseEventHandler<T>;
  onMouseEnter?: React.MouseEventHandler<T>;
  onMouseLeave?: React.MouseEventHandler<T>;
  onKeyDown?: React.KeyboardEventHandler<T>;
};


type Percentage = `${number}%`;