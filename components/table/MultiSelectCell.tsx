import Latex from '@components/latex';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function MultiSelectCell({ itemId, attr, values, handleUpdate, autocompleteItems }:
  {
    itemId: number
    attr: string
    values: string[],
    handleUpdate: (itemId: number, attr: string, value: string[]) => Promise<void>
    autocompleteItems: string[]
  }
) {
  const [cellState, setCellState] = useState("noEdit");
  const [editingValue, setEditingValue] = useState("");

  const handleTagClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div className="flex flex-wrap w-full h-full overflow-hidden"
      onClick={() => {
        console.log("clicked")
        if (cellState === "noEdit")
          setCellState("editing")
      }}
    >
      {
        values.map((value, index) => (
          <div
            key={index}
            className="tag-container bg-slate-300 m-1 pl-1 pr-2 rounded-sm flex items-center relative h-fit"
            style={{ maxWidth: 'calc(100% - 2rem)' }} // Ensure tags don’t overflow
            onClick={handleTagClick} // Prevent editing state change
          >
            <span className='mr-1'>
              <Latex>{String(value)}</Latex>
            </span>
            <CloseIcon
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from reaching the parent
                handleUpdate(itemId, attr, values.filter((_, i) => i !== index));
              }}
              className="cursor-pointer absolute top-0 right-0"
              width={5}
              sx={{ fontSize: 13 }}
            />
          </div>
        ))}
      {
        cellState === 'editing' &&
        <Autocomplete
          className=""
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
            if (newValue && cellState === 'editing') {
              handleUpdate(itemId, attr, [...values, newValue]);
              setCellState('noEdit');
              setEditingValue('');
            }
          }}
          onBlur={() => {
            if (cellState === 'editing' && editingValue) {
              handleUpdate(itemId, attr, [...values, editingValue]);
              setEditingValue('');
            }
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
                  width: 'full',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none',
                  },
                },
                '& .MuiInputBase-input': {
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                },
              }}
            />
          )}
        />
        // <Autocomplete
        //   suggestions={autocompleteItems}
        // />
      }
    </div>
  )
}
