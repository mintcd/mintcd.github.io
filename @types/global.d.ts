type Percentage = `${number}%`;

type Style = {
  width?: number
  height?: number
  padding?: number
  border?: string
}

type Listeners = {
  onClick?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onKeyDown?: React.MouseEventHandler<HTMLElement>;
};