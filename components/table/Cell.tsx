import TextCell from "./text-cell"
import ArrayCell from "./array-cell"
import { useRef, useState } from "react"
import Latex from "@components/latex"
import { dividerClasses } from "@mui/material"

export default function Cell({ content, itemId, attr }:
  {
    content: string,
    itemId: number,
    attr: AttrProps
    // handleUpdate: (id: number, attrAndValue: { [name: string]: any }) => void
  }) {
  const [cellState, setCellState] = useState<'noEdit' | 'toEdit' | 'editing'>('noEdit')
  const [editingValue, setEditingValue] = useState(content)
  const textareaRef = useRef<any>(null);

  return (
    <div>
      {(attr.type === 'string' || attr.type === 'number') &&
        <div className={`h-full w-full`}>
          {
            cellState === 'noEdit' &&
            <div className="h-full min-h-[2rem] flex items-center px-1"
              onClick={() => {
                setCellState("editing")
              }}
            >
              {attr.useLatex ?
                <Latex>
                  {String(content)}
                </Latex> : content}
            </div>
          }
          {
            cellState === 'toEdit' &&
            <textarea
              className="min-h-fit h-full w-full focus:outline-none border-none resize-none"
              name={attr.name}
              autoFocus={true}
              content={editingValue}
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
              className={`h-full w-full p-0 m-0 focus:outline-none border-none resize-none`}
              rows={Math.round(String(editingValue).length / 30) + 1}
              ref={textareaRef}
              name={attr.name}
              autoFocus={true}
              content={editingValue}
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
                    // Enter key without Shift: Handle update and exit editing mode
                    const st = attr.name
                    // handleUpdate(itemId, { [attr.name]: editingValue });
                    setCellState("noEdit");
                  }
                }
              }}
              onBlur={() => {
                // handleUpdate(itemId, { [attr.name]: editingValue });
                setCellState("noEdit");
              }}
            />

          }
        </div >
      }
      {attr.type === 'multiselect' &&
        <div className="h-full flex">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-slate-300 m-1 pl-1 pr-2 py-1 w-fit h-fit min-h-[1rem] rounded-sm flex items-center relative"
            >
              <span className='mr-1'>
                <Latex>{String(value)}</Latex>
              </span>
              <CloseIcon
                onClick={() => handleUpdate(itemId, { [attr]: values.filter((_, i) => i !== index) as typeof values })}
                className="cursor-pointer absolute top-0 right-0"
                width={5}
                sx={{ fontSize: 13 }}
              />
            </div>
          ))}
          {
            cellState === 'noEdit' &&
            <div className="h-full flex-grow"
              onClick={() => setCellState("toEdit")}
            >
            </div>
          }
          {
            cellState === 'toEdit' &&
            <input
              type="text"
              className="w-full h-fit focus:outline-none border-none m-1 pl-1 pr-2 py-1"
              name={attr}
              autoFocus={true}
              value={""}
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
            <Autocomplete
              className="w-full h-full"
              freeSolo
              options={autocompleteItems}
              inputValue={editingValue}
              clearIcon={null}
              onInputChange={(event, newInputValue) => {
                if (event && event.type === 'change') {
                  setEditingValue(newInputValue);
                }
              }}
              onChange={(event, newValue) => {
                if (newValue) {
                  handleUpdate(itemId, { [attr]: [...values, newValue] });
                  setCellState('noEdit');
                }
              }}
              onBlur={() => {
                if (editingValue) handleUpdate(itemId, { [attr]: [...values, editingValue] });
                setCellState('noEdit');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      padding: 0,
                      marginLeft: '2px',
                      backgroundColor: 'inherit',
                      '& fieldset': {
                        border: 'none', // Removes the border/outline
                      },
                      '&:hover fieldset': {
                        border: 'none', // Removes the border/outline on hover
                      },
                      '&.Mui-focused fieldset': {
                        border: 'none', // Removes the border/outline when focused
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: 'inherit', // Inherit font size
                      fontFamily: 'inherit', // Inherit font family
                    },
                  }}
                />
              )}
            />

          }
        </div>
      }
    </div>
  )
}