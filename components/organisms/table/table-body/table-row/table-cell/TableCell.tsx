import MultiSelectCell from "./MultiSelectCell"
import TextCell from "./TextCell"

export default function TableCell({ itemId, attr, value, onUpdate, suggestions, focused }:
  {
    itemId: number,
    attr: AttrProps,
    value: string | string[],
    onUpdate: (items: UpdatedItem) => void,
    suggestions?: string[],
    focused?: boolean,
  }) {

  return (
    <div className={`table-cell
            p-2
            hover:bg-blue-100 rounded-md
            ${focused ? 'border-2 border-blue-400 shadow-lg' : 'border border-transparent'}
            flex items-center`
    }
    >
      {
        attr.type === 'text' &&
        <TextCell itemId={itemId} attr={attr} value={value as string} onUpdate={onUpdate} focused={focused} />
      }
      {
        attr.type === 'multiselect' && Array.isArray(value) &&
        <MultiSelectCell itemId={itemId} attr={attr} values={value} onUpdate={onUpdate} suggestions={suggestions || []} />
      }
    </div >

  )
}