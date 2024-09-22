import Tag from '@components/atoms/Tag';
import Latex from '@components/latex';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function MultiSelectCell({ itemId, attr, values, handleUpdate, autocompleteItems }:
  {
    itemId: number
    attr: AttrProps
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
        if (cellState === "noEdit")
          setCellState("editing")
      }}
    >
      {
        values.map((value, index) => (
          <Tag
            key={index}
            value={attr.useLatex ? <Latex>{String(value)}</Latex> : <span> {value} </span>}
            onClick={handleTagClick}
            onClose={(e) => {
              e.stopPropagation(); // Prevent event from reaching the parent
              handleUpdate(itemId, attr.name, values.filter((_, i) => i !== index));
            }}
          />
        ))
      }
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
              handleUpdate(itemId, attr.name, [...values, newValue]);
              setCellState('noEdit');
              setEditingValue('');
            }
          }}
          onBlur={() => {
            if (cellState === 'editing' && editingValue) {
              handleUpdate(itemId, attr.name, [...values, editingValue]);
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
    </div >
  )
}
