import { MouseEventHandler, ReactElement } from "react";
import { CloseIcon } from '@public/icons';

export default function Tag({ value, onClick, onClose, style }:
  {
    value: ReactElement,
    onClick: (event: React.MouseEvent) => void,
    onClose: (event: React.MouseEvent) => void,
    style?: React.CSSProperties
  }
) {
  return (
    <div
      className={`tag px-1 py-[1px] my-1 rounded-full flex space-x-1 items-center h-fit`}
      style={{
        ...style,
        backgroundColor: style?.backgroundColor ?? '#cbd5e1'
      }}
      onClick={onClick} // Prevent editing state change
    >
      <span>
        {value}
      </span>
      <CloseIcon
        size={9}
        onClick={onClose}
        className="cursor-pointer"
      />
    </div>
  )
}