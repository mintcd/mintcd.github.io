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
  const [mode, setMode] = useState<"viewed" | "editing">("viewed");

  const ref = useClickAway(() => {
    setMode("viewed");
  }) as any;

  const handleTagClick = (event: React.MouseEvent) => {
    // event.stopPropagation();
  };

  useEffect(() => {
    if (focused) setMode('editing')
    else setMode("viewed")
  }, [focused])

  return (
    <div className="table-multiselect-cell w-full h-full"
      ref={ref}
      onClick={() => {
        if (mode === "viewed")
          setMode("editing")
      }}
    >
      <div className='tag-group flex flex-wrap'>
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
                backgroundColor: attr.color[value],
                marginRight: '2px'
              }}
            />
          ))
        }
      </div>

      {
        mode === 'editing' &&
        <Autocomplete
          className="tag-editor"
          autoFocus
          style={{ border: 'none' }}
          addable
          suggestions={suggestions}
          onSubmit={(newValue) => {
            if (newValue && mode === 'editing') {
              if (!values.includes(newValue)) {
                onUpdate({
                  id: itemId,
                  attrValue: { [attr.name]: [...values, newValue] }
                });
              }
              setMode("viewed");
            }
          }}
          maxDisplay={5}
          mode={mode}
        />
      }
    </div >
  )
}
