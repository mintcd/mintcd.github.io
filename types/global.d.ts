type Percentage = `${number}%`;


type Listeners = {
  onClick?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  // onKeyDown?: React.MouseEventHandler<HTMLElement>;
};

type CSSProperties = React.CSSProperties