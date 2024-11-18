
declare module 'is-hotkey'

type Factory<T extends object> = {
  [key in keyof T]: T[key];
} & {
  set: (key: keyof T, value: T[key]) => void;
};



type DefaultComponentProps = {
  className?: string
  style?: React.CSSProperties
  listeners?: Listeners
  renderers?: {
    [key: string]: (value) => React.ReactElement
  }
}

type Percentage = `${number}%`;


type Listeners = {
  onClick?: React.MouseEventHandler<Element>;
  onMouseEnter?: React.MouseEventHandler<Element>;
  onMouseLeave?: React.MouseEventHandler<Element>;
  onKeyDown?: React.KeyboardEventHandler<Element>;
};

type CSSProperties = React.CSSProperties

type Mode = "viewed" | "editing"