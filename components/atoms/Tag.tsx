import { MouseEventHandler, ReactElement } from "react";
import CloseIcon from '@mui/icons-material/Close';

export default function Tag({ value, onClick, onClose }:
  {
    value: ReactElement,
    onClick: (event: React.MouseEvent) => void,
    onClose: (event: React.MouseEvent) => void,
  }
) {
  return (
    <div
      className="tag-container bg-slate-300 m-1 pl-1 pr-2 rounded-sm flex items-center relative h-fit"

      onClick={onClick} // Prevent editing state change
    >
      <span className='mr-1'>
        {value}
      </span>
      <CloseIcon
        onClick={onClose}
        className="cursor-pointer absolute top-0 right-0"
        width={5}
        sx={{ fontSize: 13 }}
      />
    </div>
  )
}