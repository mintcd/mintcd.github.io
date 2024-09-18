import Latex from "@components/latex"
import { getTextWidth } from "@functions/text-analysis"
import { useEffect, useRef, useState } from "react"


export default function TextCell({ itemId, attr, value, state, handleUpdate }:
  {
    itemId: number
    attr: string
    value: string,
    state: 'toEdit' | 'editing' | 'noEdit',
    handleUpdate: (itemId: number, attrName: string, value: string) => Promise<void>
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

  // console.log(itemId)

  return (
    <div className={`h-full overflow-hidden`}>
      {
        cellState === 'noEdit' &&
        <div className="h-full min-h-[2rem] flex items-center"
          onClick={() => {
            setCellState("editing")
          }}
        >
          <Latex>
            {String(value)}
          </Latex>
        </div>
      }
      {
        cellState === 'toEdit' &&
        <textarea
          className="min-h-fit h-full w-full focus:outline-none border-none resize-none"
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
          className={`h-full w-full focus:outline-none border-none resize-none`}
          rows={Math.round(String(editingValue).length / 30) + 1}
          ref={textareaRef}
          name={attr}
          autoFocus={true}
          value={editingValue}
          onChange={(e) => {
            setEditingValue(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (e.shiftKey) {
                // Shift+Enter: Insert a newline character
                e.preventDefault(); // Prevent the default behavior (e.g., form submission)
                setEditingValue(editingValue + '\n');
              } else {
                handleUpdate(itemId, attr, editingValue);
                setCellState("noEdit");
              }
            }
          }}
          onBlur={() => {
            // handleUpdate(itemId, { [attr]: editingValue });
            setCellState("noEdit");
          }}
        />

      }
    </div >
  )
}