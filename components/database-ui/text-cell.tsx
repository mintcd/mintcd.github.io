import Latex from "@components/latex"
import { useEffect, useRef, useState } from "react"


export default function TextCell({ itemId, attr, value, state, handleUpdate }:
  {
    itemId: number
    attr: string
    value: string | number,
    state: 'toEdit' | 'editing' | 'noEdit',
    handleUpdate: (itemId: number, attrs: JsonObject<any>) => Promise<void>
  }
) {
  const [cellState, setCellState] = useState(state)
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

  return (
    <div>
      {
        cellState === 'noEdit' &&
        <div className="min-h-[1rem]"
          onClick={() => {
            setCellState("editing")
          }}
        >
          <Latex>{String(value)}</Latex>
        </div>
      }
      {
        cellState === 'toEdit' &&
        <textarea
          className="focus:outline-none border-none resize-none"
          name={attr}
          autoFocus={true}
          value={editingValue}
          onChange={(e) => {
            setEditingValue(e.target.value)
            setCellState('editing')
          }}
          onBlur={() => {
            setCellState("noEdit")
          }}
        />
      }
      {cellState === 'editing' &&
        <textarea
          className="w-full h-fit focus:outline-none border-none resize-none"
          rows={1}
          ref={textareaRef}
          name={attr}
          autoFocus={true}
          value={editingValue}
          onChange={(e) => {
            setEditingValue(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleUpdate(itemId, { [attr]: editingValue })
              setCellState("noEdit")
            }
          }}
          onBlur={() => {
            handleUpdate(itemId, { [attr]: editingValue })
            setCellState("noEdit")
          }}
        />
      }
      {/* {
        cellState === 'editing' &&
        <div className="w-full h-full"
          onClick={() => {
            setCellState("editing")
          }}
        >
          <Latex>{String(value)}</Latex>
        </div>
      } */}
    </div >
  )
}