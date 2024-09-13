import Latex from '@components/latex';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from 'react';


export default function ArrayCell({ itemId, attr, values, state, handleUpdate, autocompleteItems }:
  {
    itemId: number
    attr: string
    values: string[] | number[],
    state: 'toEdit' | 'editing' | 'noEdit',
    handleUpdate: (itemId: number, attrs: JsonObject<any>) => Promise<void>
    autocompleteItems: string[]
  }
) {
  const [cellState, setCellState] = useState(state)
  const [editingValue, setEditingValue] = useState("")

  // console.log(autocompleteItems)

  return (
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
          className='w-full h-full'
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
              setCellState("noEdit");
            }
          }}
          onBlur={() => {
            if (editingValue) handleUpdate(itemId, { [attr]: [...values, editingValue] });
            setCellState("noEdit");
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
              }}
            />

          )}
        />
      }
    </div>
  )
}
