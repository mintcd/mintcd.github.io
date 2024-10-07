import { MouseEventHandler, ReactElement } from "react";
import CloseIcon from '@mui/icons-material/Close';

export default function Tag({ value, onClick, onClose, style }:
  {
    value: ReactElement,
    onClick: (event: React.MouseEvent) => void,
    onClose: (event: React.MouseEvent) => void,
    style?: {
      bgColor?: string
    }
  }
) {
  return (
    <div
      className={`tag px-1 py-[1px] mx-2 my-1 rounded-full flex space-x-1 items-center h-fit`}
      style={{
        backgroundColor: style?.bgColor ?? '#cbd5e1'
      }}
      onClick={onClick} // Prevent editing state change
    >
      <span>
        {value}
      </span>
      <CloseIcon
        onClick={onClose}
        className="cursor-pointer"
        sx={{ fontSize: 13 }}
      />
    </div>
  )
}