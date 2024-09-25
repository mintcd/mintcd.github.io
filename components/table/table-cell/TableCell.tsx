import MultiSelectCell from "./MultiSelectCell"
import TextCell from "./TextCell"

export default function TableCell({ itemId, attr, value, onUpdate, suggestions }:
  {
    itemId: number,
    attr: AttrProps,
    value: string | string[],
    onUpdate: (itemId: number, attr: string, value: string | string[]) => void,
    suggestions?: string[]
  }
) {
  return (
    <>
      {
        attr.type === 'text' &&
        <TextCell itemId={itemId} attr={attr} value={value as string} onUpdate={onUpdate} />
      }
      {
        attr.type === 'multiselect' && Array.isArray(value) &&
        <MultiSelectCell itemId={itemId} attr={attr} values={value} onUpdate={onUpdate} suggestions={suggestions || []} />
      }
    </>

  )
}