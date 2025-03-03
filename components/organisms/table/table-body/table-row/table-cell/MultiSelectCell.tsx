import Tag from '@components/atoms/tag';
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
  const [mode, setMode] = useState<"view" | "edit">("view");

  const ref = useClickAway(() => {
    setMode("view");
  }) as any;

  const handleTagClick = (event: React.MouseEvent) => {
    // event.stopPropagation();
  };

  useEffect(() => {
    if (focused) setMode('edit')
    else setMode("view")
  }, [focused])

  return (
    <div className="table-multiselect-cell w-full h-full"
      ref={ref}
      onClick={() => {
        if (mode === "view")
          setMode("edit")
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
        mode === 'edit' &&
        <Autocomplete
          className="tag-editor"
          autoFocus
          style={{ border: 'none' }}
          addable
          suggestions={suggestions}
          onSubmit={(newValue) => {
            if (newValue && mode === 'edit') {
              if (!values.includes(newValue)) {
                onUpdate({
                  id: itemId,
                  attrValue: { [attr.name]: [...values, newValue] }
                });
              }
              setMode("view");
            }
          }}
          maxDisplay={5}
          mode={mode}
        />
      }
    </div >
  )
}
