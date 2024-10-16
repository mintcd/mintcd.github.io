
declare module 'is-hotkey'

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
  // onKeyDown?: React.MouseEventHandler<HTMLElement>;
};

type CSSProperties = React.CSSProperties

type Mode = "viewed" | "editing"