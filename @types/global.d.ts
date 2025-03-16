type Factory<T extends object> = {
  [key in keyof T]: T[key]; // Include the properties of T
} & {
  // Dynamically add a setter for each key
  [key in keyof T as `set${Capitalize<string & key>}`]: (
    value: T[key] | ((prev: T[key]) => T[key])
  ) => void;
} & {
  get: () => T
  set: <K extends keyof T>(key: K, value: T[K] | ((prev: T[K]) => T[K])) => void;
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

type Coordinate = {
  x: number;
  y: number;
}

type IconStyle = {
  width?: number
  height?: number,
  backgroundColor?: string,
}

type IconListeners<T extends HTMLElement = HTMLElement> = {
  onClick?: React.MouseEventHandler<SVGSVGElement>
  onMouseEnter?: React.MouseEventHandler<SVGSVGElement>
  onMouseLeave?: React.MouseEventHandler<SVGSVGElement>
};