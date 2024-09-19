import Latex from "@components/latex"
import { useEffect, useRef, useState } from "react"


export default function TextCell({ itemId, attr, value, handleUpdate }:
  {
    itemId: number
    attr: string
    value: string,
    handleUpdate: (itemId: number, attrName: string, value: string) => Promise<void>,
  }
) {
  const [cellState, setCellState] = useState('noEdit')
  const [editingValue, setEditingValue] = useState(value)

  const textareaRef = useRef<any>(null);

  useEffect(() => {
    if (cellState === 'editing' && textareaRef.current) {
      // Move the caret to the end of the textarea
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
      textareaRef.current.focus();
    }
  }, [cellState]); // Depend on cellState so that effect runs when editing state changes

  // console.log(itemId)

  return (
    <div className={`text-cell h-full ${attr !== 'id' && 'w-full'} overflow-hidden`}>
      {
        cellState === 'noEdit' &&
        <div
          className="h-full min-h-[1.75rem] flex items-center cursor-pointer"
          onClick={() => {
            setCellState("editing")
            setEditingValue(value)
          }}
        >
          <Latex>{String(value)}</Latex>
        </div>
      }
      {
        cellState === 'editing' &&
        <textarea
          className="h-full w-full p-0 focus:outline-none border-none resize-none bg-inherit"
          ref={textareaRef}
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (e.shiftKey) {
                e.preventDefault();
                setEditingValue(editingValue + '\n');
              } else {
                handleUpdate(itemId, attr, editingValue);
                setCellState("noEdit");
              }
            }
          }}
        // onBlur={() => {
        //   setCellState("noEdit");
        // }}
        />
      }
    </div>
  )
}