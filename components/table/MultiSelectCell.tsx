import Tag from '@components/atoms/Tag';
import Latex from '@components/latex';
import Autocomplete from '@components/autocomplete/Autocomplete';
import { useState } from 'react';
import { useClickAway } from "@uidotdev/usehooks";

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

  const ref = useClickAway(() => {
    setCellState('noEdit');
  }) as any;

  const handleTagClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div className="multiselect-cell flex flex-wrap w-full h-full"
      ref={ref}
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
          icon={false}
          autoFocus
          style={{ border: 'none' }}
          freeSolo
          suggestions={autocompleteItems}
          onSubmit={(newValue) => {
            if (newValue && cellState === 'editing') {
              handleUpdate(itemId, attr.name, [...values, newValue]);
              setCellState('noEdit');
              setEditingValue('');
            }
          }}
        />
      }
    </div >
  )
}
