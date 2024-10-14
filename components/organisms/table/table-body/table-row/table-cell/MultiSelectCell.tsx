import Tag from '@components/nuclears/Tag';
import Latex from '@components/atoms/latex';
import Autocomplete from '@components/molecules/autocomplete/Autocomplete';
import { useEffect, useState } from 'react';
import { useClickAway } from "@uidotdev/usehooks";

export default function MultiSelectCell({ itemId, attr, values, onUpdate, suggestions, focused }:
  {
    itemId: number
    attr: AttrProps
    values: string[],
    onUpdate: (items: UpdatedItem) => void
    suggestions: string[],
    focused?: boolean
  }
) {
  const [cellState, setCellState] = useState("noEdit");

  const ref = useClickAway(() => {
    setCellState('noEdit');
  }) as any;

  const handleTagClick = (event: React.MouseEvent) => {
    // event.stopPropagation();
  };

  useEffect(() => {
    if (focused) setCellState('editing')
    else setCellState('noEdit')
  }, [focused])

  return (
    <div className="table-multiselect-cell flex flex-wrap w-full h-full"
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
              onUpdate({
                id: itemId,
                attrValue: {
                  [attr.name]: values.filter((_, i) => i !== index)
                }
              })
            }}
            style={{
              bgColor: attr.color[value]
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
          addable
          suggestions={suggestions}
          onSubmit={(newValue) => {
            if (newValue && cellState === 'editing') {
              if (!values.includes(newValue)) {
                onUpdate({
                  id: itemId,
                  attrValue: { [attr.name]: [...values, newValue] }
                });
              }
              setCellState('noEdit');
            }
          }}
          maxDisplay={5}
        />
      }
    </div >
  )
}
